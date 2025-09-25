import React, { useState, useRef } from 'react';
import { UploadIcon, FileIcon, ImageIcon, MusicIcon } from 'lucide-react';
interface MediaUploadProps {
  type: 'image' | 'audio' | 'any';
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}
const MediaUpload: React.FC<MediaUploadProps> = ({
  type,
  onFileSelect,
  accept,
  maxSize = 10 // Default max size: 10MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Get accept attribute based on type
  const getAcceptAttribute = () => {
    if (accept) return accept;
    switch (type) {
      case 'image':
        return 'image/*';
      case 'audio':
        return 'audio/*';
      default:
        return undefined;
    }
  };
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-text-tertiary" />;
      case 'audio':
        return <MusicIcon className="h-8 w-8 text-text-tertiary" />;
      default:
        return <FileIcon className="h-8 w-8 text-text-tertiary" />;
    }
  };
  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;
    const file = files[0];
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    // Check file type for images
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    // Check file type for audio
    if (type === 'audio' && !file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }
    onFileSelect(file);
  };
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };
  // Handle click to select file
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return <div className="w-full">
      <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}>
        <input type="file" ref={fileInputRef} className="hidden" accept={getAcceptAttribute()} onChange={e => handleFileSelect(e.target.files)} />
        <div className="flex flex-col items-center justify-center py-4">
          {getIcon()}
          <p className="mt-2 text-sm font-medium text-text-secondary">
            {isDragging ? 'Drop file here' : <>
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </>}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            {type === 'image' ? 'PNG, JPG, GIF up to 10MB' : type === 'audio' ? 'MP3, WAV up to 10MB' : 'Files up to 10MB'}
          </p>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>;
};
export default MediaUpload;