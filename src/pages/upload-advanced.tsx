import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUpload,
  IconFolder,
  IconFile,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconFolderPlus,
  IconTrash,
  IconCloudUpload,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  folderPath?: string;
}

interface UploadStats {
  totalFiles: number;
  uploadedFiles: number;
  failedFiles: number;
  totalSize: number;
  uploadedSize: number;
}

export default function UploadAdvancedPage() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats>({
    totalFiles: 0,
    uploadedFiles: 0,
    failedFiles: 0,
    totalSize: 0,
    uploadedSize: 0,
  });
  const [showFolderUpload, setShowFolderUpload] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[], event: any) => {
      const newFiles: UploadFile[] = acceptedFiles.map((file) => {
        // Extract folder path from webkitRelativePath if available
        const folderPath = (file as any).webkitRelativePath
          ? (file as any).webkitRelativePath.split("/").slice(0, -1).join("/")
          : undefined;

        return {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          status: "pending",
          progress: 0,
          folderPath,
        };
      });

      setUploadFiles((prev) => [...prev, ...newFiles]);

      // Update stats
      const totalSize = newFiles.reduce((sum, file) => sum + file.file.size, 0);
      setUploadStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles + newFiles.length,
        totalSize: prev.totalSize + totalSize,
      }));
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: false,
  });

  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newFiles: UploadFile[] = fileArray.map((file) => {
        const folderPath = (file as any).webkitRelativePath
          ? (file as any).webkitRelativePath.split("/").slice(0, -1).join("/")
          : "root";

        return {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          status: "pending",
          progress: 0,
          folderPath,
        };
      });

      setUploadFiles((prev) => [...prev, ...newFiles]);

      const totalSize = newFiles.reduce((sum, file) => sum + file.file.size, 0);
      setUploadStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles + newFiles.length,
        totalSize: prev.totalSize + totalSize,
      }));
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        setUploadStats((prevStats) => ({
          ...prevStats,
          totalFiles: prevStats.totalFiles - 1,
          totalSize: prevStats.totalSize - fileToRemove.file.size,
        }));
      }
      return prev.filter((file) => file.id !== id);
    });
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    setUploadStats((prev) => ({
      ...prev,
      uploadedFiles: 0,
      failedFiles: 0,
      uploadedSize: 0,
    }));

    const formData = new FormData();
    uploadFiles.forEach((uploadFile) => {
      formData.append("files", uploadFile.file);
      if (uploadFile.folderPath) {
        formData.append("folderPaths", uploadFile.folderPath);
      }
    });

    try {
      const response = await fetch("/api/upload-advanced", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      // Update file statuses based on result
      setUploadFiles((prev) =>
        prev.map((file) => {
          const resultItem = result.results.find(
            (r: any) => r.fileName === file.file.name
          );
          if (resultItem?.success) {
            setUploadStats((prevStats) => ({
              ...prevStats,
              uploadedFiles: prevStats.uploadedFiles + 1,
              uploadedSize: prevStats.uploadedSize + file.file.size,
            }));
            return { ...file, status: "success" as const, progress: 100 };
          } else {
            setUploadStats((prevStats) => ({
              ...prevStats,
              failedFiles: prevStats.failedFiles + 1,
            }));
            return {
              ...file,
              status: "error" as const,
              error: resultItem?.error || "Upload failed",
            };
          }
        })
      );
    } catch (error) {
      console.error("Upload error:", error);
      setUploadFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "error" as const,
          error: "Upload failed",
        }))
      );
      setUploadStats((prev) => ({ ...prev, failedFiles: prev.totalFiles }));
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    setUploadFiles([]);
    setUploadStats({
      totalFiles: 0,
      uploadedFiles: 0,
      failedFiles: 0,
      totalSize: 0,
      uploadedSize: 0,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const docExtensions = ["pdf", "doc", "docx", "txt", "rtf"];
    const codeExtensions = ["js", "ts", "jsx", "tsx", "html", "css", "json"];

    if (imageExtensions.includes(extension || "")) {
      return "🖼️";
    } else if (docExtensions.includes(extension || "")) {
      return "📄";
    } else if (codeExtensions.includes(extension || "")) {
      return "💻";
    }
    return "📁";
  };

  const groupedFiles = uploadFiles.reduce((groups, file) => {
    const folder = file.folderPath || "root";
    if (!groups[folder]) {
      groups[folder] = [];
    }
    groups[folder].push(file);
    return groups;
  }, {} as Record<string, UploadFile[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Advanced File Upload
          </h1>
          <p className="text-gray-300">
            Upload multiple files or entire folders to Azure Blob Storage
          </p>
        </div>

        {/* Upload Area */}
        <div {...getRootProps()}>
          <motion.div
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300",
              isDragActive
                ? "border-blue-400 bg-blue-50/10"
                : "border-gray-600 hover:border-gray-500"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              {isDragActive ? (
                <IconUpload className="h-16 w-16 text-blue-400" />
              ) : (
                <IconFolder className="h-16 w-16 text-gray-400" />
              )}
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-gray-400">or click to select files</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Folder Upload Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => folderInputRef.current?.click()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <IconFolderPlus className="h-5 w-5" />
            <span>Select Folder</span>
          </button>
          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: "" } as any)}
            multiple
            onChange={handleFolderSelect}
            className="hidden"
          />
        </div>

        {/* Upload Stats */}
        {uploadStats.totalFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {uploadStats.totalFiles}
                </div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {uploadStats.uploadedFiles}
                </div>
                <div className="text-sm text-gray-400">Uploaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {uploadStats.failedFiles}
                </div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatFileSize(uploadStats.totalSize)}
                </div>
                <div className="text-sm text-gray-400">Total Size</div>
              </div>
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Overall Progress</span>
                  <span>
                    {Math.round(
                      (uploadStats.uploadedFiles / uploadStats.totalFiles) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (uploadStats.uploadedFiles / uploadStats.totalFiles) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                Files ({uploadStats.totalFiles})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <IconTrash className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <IconCloudUpload className="h-4 w-4" />
                  <span>{isUploading ? "Uploading..." : "Upload All"}</span>
                </button>
              </div>
            </div>

            {/* File Groups */}
            <div className="space-y-6">
              {Object.entries(groupedFiles).map(([folder, files]) => (
                <div key={folder} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <IconFolder className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-lg font-semibold text-white">
                      {folder === "root" ? "Root Directory" : folder}
                    </h4>
                    <span className="text-sm text-gray-400">
                      ({files.length} files)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence>
                      {files.map((uploadFile) => (
                        <motion.div
                          key={uploadFile.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <span className="text-lg">
                              {getFileIcon(uploadFile.file.name)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white truncate">
                                {uploadFile.file.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {formatFileSize(uploadFile.file.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Status Icon */}
                            {uploadFile.status === "pending" && (
                              <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
                            )}
                            {uploadFile.status === "uploading" && (
                              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            )}
                            {uploadFile.status === "success" && (
                              <IconCheck className="h-4 w-4 text-green-400" />
                            )}
                            {uploadFile.status === "error" && (
                              <IconAlertCircle
                                className="h-4 w-4 text-red-400"
                                title={uploadFile.error}
                              />
                            )}

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFile(uploadFile.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <IconX className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
