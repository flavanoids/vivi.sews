import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { apiService } from '../services/api';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageUpload?: (imageUrl: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
  uploadType?: 'fabric' | 'project' | 'pattern';
}

export default function ImageUpload({ 
  onImageSelect, 
  onImageUpload, 
  currentImage, 
  onImageRemove, 
  uploadType = 'fabric' 
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Update preview when currentImage prop changes
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = async (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);

      // Upload the file if onImageUpload is provided
      if (onImageUpload) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('image', file);

          let uploadResponse;
          if (uploadType === 'fabric') {
            uploadResponse = await apiService.uploadFabricImage(formData);
          } else if (uploadType === 'project') {
            uploadResponse = await apiService.uploadProjectImage(formData);
          } else {
            throw new Error('Unsupported upload type');
          }

          onImageUpload(uploadResponse.url);
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Failed to upload image. Please try again.');
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setPreview(null);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (preview) {
    return (
      <div className="relative">
        <img 
          src={preview} 
          alt="Fabric preview" 
          className="w-full aspect-square object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={removeImage}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div className="text-center">
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
          <Camera className="w-full h-full" />
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <p>Upload a photo of your {uploadType}</p>
          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          {isUploading && <p className="text-xs text-blue-500">Uploading...</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
}