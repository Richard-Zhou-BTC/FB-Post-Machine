import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageLibraryProps {
  images: UploadedImage[];
  onUpload: (newImages: UploadedImage[]) => void;
  onRemove: (id: string) => void;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ images, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages: UploadedImage[] = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64String = (event.target.result as string).split(',')[1];
            newImages.push({
              id: crypto.randomUUID(),
              url: URL.createObjectURL(file),
              base64: base64String,
              mimeType: file.type,
              file: file
            });

            if (newImages.length === files.length) {
              onUpload(newImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <ImageIcon className="text-amber-600" size={20} />
          Media Library ({images.length})
        </h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <Upload size={16} />
          Add Images
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[200px] border-2 border-dashed border-slate-200 rounded-lg p-4">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Upload size={48} className="mb-2 opacity-50" />
            <p className="text-center">Drag and drop photos here<br />or click 'Add Images'</p>
            <p className="text-xs mt-2 text-slate-300">Upload your furniture catalog</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemove(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-3">
        * The AI will randomly select 2-3 images from this library for each post.
      </p>
    </div>
  );
};
