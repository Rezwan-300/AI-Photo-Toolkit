import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  onClear: () => void;
  currentImage: string | null;
  className?: string;
}

export function ImageUpload({ onUpload, onClear, currentImage, className }: ImageUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    }
  });

  if (currentImage) {
    return (
      <div className={cn("relative group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900", className)}>
        <img src={currentImage} alt="Uploaded" className="w-full h-auto max-h-[500px] object-contain" />
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all",
        isDragActive ? "border-blue-500 bg-blue-500/5" : "border-neutral-800 hover:border-neutral-700 bg-neutral-900/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Upload className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Click or drag to upload</h3>
      <p className="text-neutral-500 text-center max-w-xs">
        Support for JPG, PNG, and WebP. Max file size 10MB.
      </p>
    </div>
  );
}
