import { NextApiRequest, NextApiResponse } from "next";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
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
  sasUrl?: string;
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
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    if (!connectionString || !accountName || !accountKey) {
      return res.status(500).json({
        success: false,
        error: "Azure Storage configuration is missing",
      });
    }

    // Initialize Azure Blob Storage client
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists();

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = imageFile.originalFilename || "unknown";
    const extension = originalName.split(".").pop() || "jpg";
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();
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

    // Generate SAS URL for the uploaded image
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: containerName,
        blobName: blobName,
        permissions: BlobSASPermissions.parse("r"), // Read permission only
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
      },
      sharedKeyCredential
    );

    const sasUrl = `${blockBlobClient.url}?${sasToken}`;

    // Clean up temporary file
    await fs.unlink(imageFile.filepath);

    // Return success response
    const result: ImageUploadResult = {
      success: true,
      id: `${timestamp}-${sanitizedTitle}`,
      sasUrl: sasUrl,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Image upload API error:", error);

    // Note: We can't clean up the temporary file here because the request stream
    // has already been consumed and we can't re-parse it. The file will be
    // cleaned up by the OS eventually.

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
