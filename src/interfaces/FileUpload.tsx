export interface FileUploadProps {
  onFilesSelected?: (files: FileList) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
}