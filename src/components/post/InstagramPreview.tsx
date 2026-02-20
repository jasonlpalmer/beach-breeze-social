'use client';

import { PlatformContent, MediaFile, MusicTrack } from '@/types/post';
import { Heart, MessageCircle, Send, Bookmark, Music } from 'lucide-react';
import Image from 'next/image';

interface InstagramPreviewProps {
  content: PlatformContent;
  media: MediaFile[];
  music?: MusicTrack | null;
}

export default function InstagramPreview({
  content,
  media,
  music,
}: InstagramPreviewProps) {
  const captionWithHashtags = [
    content.caption,
    content.hashtags.length > 0
      ? content.hashtags.map((h) => `#${h}`).join(' ')
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const truncated =
    captionWithHashtags.length > 125
      ? captionWithHashtags.slice(0, 125) + '... more'
      : captionWithHashtags;

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45]">
          <Image src="/logo.svg" alt="" width={20} height={20} className="rounded-full" />
        </div>
        <p className="text-sm font-semibold text-gray-900">beachbreezeboxers</p>
      </div>

      {/* Media */}
      {media.length > 0 ? (
        media[0].type === 'image' ? (
          <img
            src={media[0].url}
            alt=""
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-gray-900">
            <span className="text-sm text-white/60">Video Preview</span>
          </div>
        )
      ) : (
        <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-ocean-200 to-ocean-400">
          <Image src="/logo.svg" alt="" width={80} height={80} className="opacity-50" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-4">
          <Heart size={24} className="text-gray-900" />
          <MessageCircle size={24} className="text-gray-900" />
          <Send size={24} className="text-gray-900" />
        </div>
        <Bookmark size={24} className="text-gray-900" />
      </div>

      {/* Music indicator */}
      {music && (
        <div className="flex items-center gap-2 px-4 py-1.5">
          <Music size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">{music.title}</span>
        </div>
      )}

      {/* Caption */}
      {captionWithHashtags && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">beachbreezeboxers</span>{' '}
            <span className="whitespace-pre-wrap">{truncated}</span>
          </p>
        </div>
      )}
    </div>
  );
}
