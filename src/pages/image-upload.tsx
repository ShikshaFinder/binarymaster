import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconCheck,
  IconDownload,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ImageItem {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  sasUrl: string;
  uploadDate: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function ImageUploadPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setCurrentImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    noClick: false,
  });

  const handleUpload = async () => {
    if (!currentImage || !title.trim()) {
      alert("Please select an image and provide a title");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", currentImage);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      if (result.success) {
        const newImage: ImageItem = {
          id: result.id,
          title: title,
          description: description,
          fileName: currentImage.name,
          fileSize: currentImage.size,
          sasUrl: result.sasUrl,
          uploadDate: new Date().toISOString(),
          status: "success",
        };

        setImages((prev) => [...prev, newImage]);

        // Reset form
        setCurrentImage(null);
        setTitle("");
        setDescription("");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const downloadJson = () => {
    if (images.length === 0) {
      alert("No images to export");
      return;
    }

    const jsonData = {
      exportDate: new Date().toISOString(),
      totalImages: images.length,
      images: images.map((img) => ({
        id: img.id,
        title: img.title,
        description: img.description,
        fileName: img.fileName,
        fileSize: img.fileSize,
        sasUrl: img.sasUrl,
        uploadDate: img.uploadDate,
      })),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `image-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setImages([]);
    setCurrentImage(null);
    setTitle("");
    setDescription("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Image Upload</h1>
          <p className="text-gray-300">
            Upload images with title and description, then export as JSON
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Upload New Image
              </h2>

              {/* Image Upload Area */}
              <div {...getRootProps()} className="mb-6">
                <motion.div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
                    isDragActive
                      ? "border-blue-400 bg-blue-50/10"
                      : "border-gray-600 hover:border-gray-500"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center space-y-4">
                    {currentImage ? (
                      <>
                        <IconPhoto className="h-16 w-16 text-green-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {currentImage.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(currentImage.size)}
                          </p>
                        </div>
                      </>
                    ) : isDragActive ? (
                      <>
                        <IconUpload className="h-16 w-16 text-blue-400" />
                        <p className="text-lg font-semibold text-white">
                          Drop image here
                        </p>
                      </>
                    ) : (
                      <>
                        <IconPhoto className="h-16 w-16 text-gray-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">
                            Drag & drop an image here
                          </p>
                          <p className="text-gray-400">or click to select</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter image title"
                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter image description"
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={isUploading || !currentImage || !title.trim()}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <IconUpload className="h-4 w-4" />
                      <span>Upload Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Images List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Uploaded Images ({images.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={downloadJson}
                  disabled={images.length === 0}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <IconDownload className="h-4 w-4" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={clearAll}
                  disabled={images.length === 0}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <IconTrash className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <IconPhoto className="h-5 w-5 text-blue-400" />
                          <h3 className="text-lg font-semibold text-white truncate">
                            {image.title}
                          </h3>
                          <IconCheck className="h-4 w-4 text-green-400" />
                        </div>

                        {image.description && (
                          <p className="text-gray-300 text-sm mb-2">
                            {image.description}
                          </p>
                        )}

                        <div className="text-xs text-gray-400 space-y-1">
                          <p>File: {image.fileName}</p>
                          <p>Size: {formatFileSize(image.fileSize)}</p>
                          <p>
                            Uploaded:{" "}
                            {new Date(image.uploadDate).toLocaleString()}
                          </p>
                        </div>

                        <div className="mt-3">
                          <a
                            href={image.sasUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            View Image
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => removeImage(image.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <IconPhoto className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No images uploaded yet</p>
                  <p className="text-sm">
                    Upload your first image to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
