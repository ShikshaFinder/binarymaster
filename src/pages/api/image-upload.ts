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

interface ImageUploadResult {
  success: boolean;
  id?: string;
  url?: string;
  error?: string;
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
      multiples: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB max file size for images
    });

    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Validate required fields
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description || "";
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!title || !imageFile) {
      return res.status(400).json({
        success: false,
        error: "Title and image are required",
      });
    }

    // Validate image file
    if (!imageFile.mimetype?.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        error: "File must be an image",
      });
    }

    // Get Azure Blob Storage configuration
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "images";

    if (!connectionString) {
      return res.status(500).json({
        success: false,
        error: "Azure Storage connection string not configured",
      });
    }

    // Initialize Azure Blob Storage client
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists();

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = imageFile.originalFilename || "unknown";
      const extension = originalName.split(".").pop() || "jpg";
      const sanitizedTitle = title
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .toLowerCase();
      const blobName = `${timestamp}-${sanitizedTitle}.${extension}`;

      // Get blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Read file content
      const fileContent = await fs.readFile(imageFile.filepath);

      // Upload to Azure Blob Storage with metadata
      await blockBlobClient.upload(fileContent, fileContent.length, {
        blobHTTPHeaders: {
          blobContentType: imageFile.mimetype,
        },
        metadata: {
          title: title,
          description: description,
          originalName: originalName,
          uploadTimestamp: timestamp.toString(),
          fileSize: fileContent.length.toString(),
        },
      });

      // Generate URL
      const url = blockBlobClient.url;

      // Clean up temporary file
      await fs.unlink(imageFile.filepath);

      // Return success response
      const result: ImageUploadResult = {
        success: true,
        id: `${timestamp}-${sanitizedTitle}`,
        url: url,
      };

      res.status(200).json(result);
    } catch (error) {
      console.error("Error uploading image:", error);

      // Clean up temporary file even if upload failed
      try {
        await fs.unlink(imageFile.filepath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }

      res.status(500).json({
        success: false,
        error: "Failed to upload image",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Image upload API error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
