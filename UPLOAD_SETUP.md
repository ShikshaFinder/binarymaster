# File Upload Setup Guide

This guide explains how to set up the file upload functionality with Azure Blob Storage.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Azure Blob Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your_account_name;AccountKey=your_account_key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=documents

# Optional: SAS Token for client-side uploads (if using the existing file-upload component)
NEXT_PUBLIC_AZURE_SAS_TOKEN=your_sas_token_here
```

## Azure Blob Storage Setup

1. **Create an Azure Storage Account:**
   - Go to Azure Portal
   - Create a new Storage Account
   - Note down the account name and access key

2. **Get Connection String:**
   - In your Storage Account, go to "Access keys"
   - Copy the connection string

3. **Create Container:**
   - In your Storage Account, go to "Containers"
   - Create a new container named "documents" (or update the environment variable)

## Available Pages

### Basic Upload (`/upload`)
- Simple multiple file upload
- Drag and drop interface
- Basic progress tracking

### Advanced Upload (`/upload-advanced`)
- Folder upload support
- Preserves folder structure
- Enhanced progress tracking
- File grouping by folder
- Better error handling

## API Endpoints

### `/api/upload`
- Basic file upload endpoint
- Handles multiple files
- Simple error handling

### `/api/upload-advanced`
- Advanced upload endpoint
- Preserves folder structure
- Enhanced metadata
- Better error reporting

## Features

- **Multiple File Upload:** Upload multiple files at once
- **Folder Upload:** Upload entire folders while preserving structure
- **Drag & Drop:** Modern drag and drop interface
- **Progress Tracking:** Real-time upload progress
- **Error Handling:** Comprehensive error reporting
- **File Validation:** File size and type validation
- **Azure Integration:** Direct upload to Azure Blob Storage
- **Responsive Design:** Works on desktop and mobile

## Usage

1. Navigate to `/upload` for basic uploads
2. Navigate to `/upload-advanced` for folder uploads
3. Drag and drop files or click to select
4. Use the "Select Folder" button for folder uploads
5. Click "Upload All" to start the upload process

## Security Notes

- Never expose your Azure connection string in client-side code
- Use SAS tokens for client-side uploads if needed
- Implement proper authentication and authorization
- Consider implementing file type restrictions
- Set appropriate file size limits

## Troubleshooting

### Common Issues

1. **Connection String Error:**
   - Verify your Azure connection string is correct
   - Ensure the storage account exists and is accessible

2. **Container Not Found:**
   - Create the container in Azure Portal
   - Check the container name in environment variables

3. **File Size Limits:**
   - Default limit is 100MB per file
   - Adjust in the API route if needed

4. **Permission Errors:**
   - Ensure your Azure account has proper permissions
   - Check if the storage account allows public access if needed 