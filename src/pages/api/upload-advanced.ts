import { NextApiRequest, NextApiResponse } from "next";
import { BlobServiceClient } from "@azure/storage-blob";
import formidable from "formidable";
import { promises as fs } from "fs";

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResult {
  success: boolean;
  fileName: string;
  originalPath?: string;
  blobPath?: string;
  url?: string;
  error?: string;
  size?: number;
}
interface UploadRequest {
  files: formidable.File[];
  folderPaths?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the form data
    const form = formidable({
      multiples: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB max file size
      maxFields: 1000, // Allow many fields for folder paths
    });

    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Get Azure Blob Storage configuration
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME || "documents";

    if (!connectionString) {
      return res
        .status(500)
        .json({ error: "Azure Storage connection string not configured" });
    }

    // Initialize Azure Blob Storage client
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists();

    const results: UploadResult[] = [];
    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    const folderPathsArray = fields.folderPaths 
      ? (Array.isArray(fields.folderPaths) ? fields.folderPaths : [fields.folderPaths])
      : [];

    // Upload each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (!file) continue;

      try {
        // Get folder path if available
        const folderPath = folderPathsArray[i] || '';
        
        // Generate unique filename with timestamp and preserve folder structure
        const timestamp = Date.now();
        const originalName = file.originalFilename || "unknown";
        const sanitizedFolderPath = folderPath.replace(/[^a-zA-Z0-9-_/]/g, '_');
        
        // Create blob path with folder structure
        const blobPath = sanitizedFolderPath 
          ? `${sanitizedFolderPath}/${timestamp}-${originalName}`
          : `${timestamp}-${originalName}`;

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

        // Read file content
        const fileContent = await fs.readFile(file.filepath);

        // Upload to Azure Blob Storage with metadata
        await blockBlobClient.upload(fileContent, fileContent.length, {
          blobHTTPHeaders: {
            blobContentType: file.mimetype || "application/octet-stream",
          },
          metadata: {
            originalPath: folderPath,
            originalName: originalName,
            uploadTimestamp: timestamp.toString(),
            fileSize: fileContent.length.toString(),
          },
        });

        // Generate URL
        const url = blockBlobClient.url;

        results.push({
          success: true,
          fileName: originalName,
          originalPath: folderPath,
          blobPath: blobPath,
          url,
          size: fileContent.length,
        });

        // Clean up temporary file
        await fs.unlink(file.filepath);

      } catch (error) {
        console.error(`Error uploading file ${file.originalFilename}:`, error);

        results.push({
          success: false,
          fileName: file.originalFilename || "unknown",
          originalPath: folderPathsArray[i] || '',
          error: error instanceof Error ? error.message : "Unknown error",
        });

        // Clean up temporary file even if upload failed
        try {
          await fs.unlink(file.filepath);
        } catch (cleanupError) {
          console.error("Error cleaning up temporary file:", cleanupError);
        }
      }
    }

    // Calculate summary statistics
    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.length - successCount;
    const totalSize = results
      .filter((r) => r.success && r.size)
      .reduce((sum, r) => sum + (r.size || 0), 0);

    // Group results by folder
    const folderGroups = results.reduce((groups, result) => {
      const folder = result.originalPath || 'root';
      if (!groups[folder]) {
        groups[folder] = [];
      }
      groups[folder].push(result);
      return groups;
    }, {} as Record<string, UploadResult[]>);

    res.status(200).json({
      message: `Upload completed. ${successCount} files uploaded successfully, ${errorCount} failed.`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: errorCount,
        totalSize,
        folderGroups,
      },
    });

  } catch (error) {
    console.error("Upload API error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
} 