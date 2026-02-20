'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Upload, ImageIcon, Film } from 'lucide-react';
import { MediaFile } from '@/types/post';
import { cn, formatFileSize } from '@/lib/utils';

interface MediaUploaderProps {
  media: MediaFile[];
  onMediaChange: (media: MediaFile[]) => void;
}

export default function MediaUploader({
  media,
  onMediaChange,
}: MediaUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newFile: MediaFile = {
            id: uuidv4(),
            name: file.name,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            mimeType: file.type,
            size: file.size,
            url: reader.result as string,
          };
          onMediaChange([...media, newFile]);
        };
        reader.readAsDataURL(file);
      });
    },
    [media, onMediaChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.mov', '.webm'],
    },
    maxSize: 50 * 1024 * 1024,
  });

  const removeMedia = (id: string) => {
    onMediaChange(media.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-ocean-400 bg-ocean-50'
            : 'border-foam-200 bg-white hover:border-ocean-300 hover:bg-ocean-50/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-100">
            <Upload size={24} className="text-ocean-500" />
          </div>
          <div>
            <p className="font-display font-semibold text-deep-600">
              {isDragActive ? 'Drop files here' : 'Upload Media'}
            </p>
            <p className="mt-1 text-sm text-foam-300">
              Drag & drop images or videos, or click to browse
            </p>
            <p className="mt-1 text-xs text-foam-300">
              JPG, PNG, WebP, GIF, MP4, MOV (max 50MB)
            </p>
          </div>
        </div>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map((file) => (
            <div
              key={file.id}
              className="group relative overflow-hidden rounded-xl border border-foam-200 bg-white"
            >
              {file.type === 'image' ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-deep-700">
                  <Film size={32} className="text-white/60" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => removeMedia(file.id)}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-deep-600">
                  {file.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-foam-300">
                  {file.type === 'image' ? (
                    <ImageIcon size={12} />
                  ) : (
                    <Film size={12} />
                  )}
                  {formatFileSize(file.size)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
