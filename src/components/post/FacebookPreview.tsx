'use client';

import { PlatformContent, MediaFile, MusicTrack } from '@/types/post';
import { ThumbsUp, MessageCircle, Share2, Globe, Music } from 'lucide-react';
import Image from 'next/image';

interface FacebookPreviewProps {
  content: PlatformContent;
  media: MediaFile[];
  music?: MusicTrack | null;
}

export default function FacebookPreview({
  content,
  media,
  music,
}: FacebookPreviewProps) {
  const fullText = [
    content.caption,
    content.hashtags.length > 0
      ? content.hashtags.map((h) => `#${h}`).join(' ')
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]">
          <Image src="/logo.svg" alt="" width={24} height={24} className="rounded-full" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Beach Breeze Boxers
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Just now</span>
            <span>·</span>
            <Globe size={12} />
          </div>
        </div>
      </div>

      {/* Caption */}
      {fullText && (
        <div className="px-4 pb-3">
          <p className="whitespace-pre-wrap text-sm text-gray-900">
            {fullText}
          </p>
        </div>
      )}

      {/* Media */}
      {media.length > 0 && (
        <div className="border-t border-gray-100">
          {media[0].type === 'image' ? (
            <img
              src={media[0].url}
              alt=""
              className="w-full object-cover"
              style={{ maxHeight: 400 }}
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-900">
              <span className="text-sm text-white/60">Video Preview</span>
            </div>
          )}
        </div>
      )}

      {/* Music indicator */}
      {music && (
        <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2">
          <Music size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500">{music.title} - {music.artist}</span>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-200 px-4 py-2">
        <div className="flex justify-between">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ThumbsUp size={18} />
            Like
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <MessageCircle size={18} />
            Comment
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
