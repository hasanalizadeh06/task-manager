'use client';

import { FileUploadProps } from '@/interfaces/FileUpload';
import { useState, useRef } from 'react';
import { RiFolderUploadLine } from "react-icons/ri";

export default function FileUpload({ 
  onFilesSelected, 
  acceptedFileTypes = "*/*", 
  maxFiles = 10 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  // const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const limitedFiles = newFiles.slice(0, maxFiles);
    // setFiles(prev => [...prev, ...limitedFiles]);
    
    if (onFilesSelected) {
      const fileList = new DataTransfer();
      limitedFiles.forEach(file => fileList.items.add(file));
      onFilesSelected(fileList.files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // const removeFile = (index: number) => {
  //   setFiles(prev => prev.filter((_, i) => i !== index));
  // };

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  return (
    <div className="w-full h-full">      
      <div
        className={`
          relative bg-[#ffffff1a] h-full flex justify-center items-center rounded-2xl p-16 text-center transition-all duration-200
          ${isDragOver 
            ? 'bg-green-400/10' 
            : ''
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <h2 className="text-white text-xl font-medium absolute top-2 left-4">Files</h2>
            <span className='flex items-center justify-center gap-1'><RiFolderUploadLine size={25}/> Drop files to attach or</span>
            <button
              onClick={handleBrowseClick}
              className="px-4 py-2 border border-green-500 text-green-400 rounded-4xl hover:bg-green-500/10 transition-colors duration-200"
            >
              Browse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}