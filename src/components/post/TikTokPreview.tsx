'use client';

import { PlatformContent, MediaFile, MusicTrack } from '@/types/post';
import { Heart, MessageCircle, Share2, Music, Bookmark } from 'lucide-react';
import Image from 'next/image';

interface TikTokPreviewProps {
  content: PlatformContent;
  media: MediaFile[];
  music?: MusicTrack | null;
}

export default function TikTokPreview({
  content,
  media,
  music,
}: TikTokPreviewProps) {
  const hashtags = content.hashtags.map((h) => `#${h}`).join(' ');

  return (
    <div className="mx-auto max-w-[280px]">
      <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '9/16' }}>
        {/* Background */}
        {media.length > 0 && media[0].type === 'image' ? (
          <img
            src={media[0].url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : media.length > 0 ? (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-deep-600 to-deep-700">
            <div className="flex h-full items-center justify-center">
              <Image src="/logo.svg" alt="" width={60} height={60} className="opacity-30" />
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Right sidebar icons */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
            <Image src="/logo.svg" alt="" width={24} height={24} className="rounded-full" />
          </div>
          <div className="flex flex-col items-center">
            <Heart size={28} className="text-white" />
            <span className="mt-1 text-xs text-white">42.1K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle size={28} className="text-white" />
            <span className="mt-1 text-xs text-white">1,204</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark size={28} className="text-white" />
            <span className="mt-1 text-xs text-white">8,392</span>
          </div>
          <div className="flex flex-col items-center">
            <Share2 size={28} className="text-white" />
            <span className="mt-1 text-xs text-white">Share</span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-4 left-3 right-16">
          <p className="mb-1 text-sm font-semibold text-white">
            @beachbreezeboxers
          </p>
          {content.caption && (
            <p className="mb-2 text-xs leading-relaxed text-white/90 line-clamp-3">
              {content.caption}
            </p>
          )}
          {hashtags && (
            <p className="mb-3 text-xs font-medium text-white/80">
              {hashtags}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Music size={12} className="text-white" />
            <p className="animate-pulse text-xs text-white/70">
              {music ? `${music.title} - ${music.artist}` : 'Original Sound - Beach Breeze Boxers'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
