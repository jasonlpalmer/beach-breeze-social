'use client';

import { useState } from 'react';
import { Platform, PlatformContent, MediaFile, MusicTrack } from '@/types/post';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import FacebookPreview from './FacebookPreview';
import InstagramPreview from './InstagramPreview';
import TikTokPreview from './TikTokPreview';

interface PlatformPreviewProps {
  platforms: Platform[];
  content: PlatformContent[];
  media: MediaFile[];
  music?: MusicTrack | null;
}

export default function PlatformPreview({
  platforms,
  content,
  media,
  music,
}: PlatformPreviewProps) {
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0]);
  const [copied, setCopied] = useState<Platform | null>(null);

  if (!platforms.includes(activeTab) && platforms.length > 0) {
    setActiveTab(platforms[0]);
  }

  const getContent = (platform: Platform): PlatformContent => {
    return (
      content.find((c) => c.platform === platform) || {
        platform,
        caption: '',
        hashtags: [],
      }
    );
  };

  const copyToClipboard = (platform: Platform) => {
    const c = getContent(platform);
    const text = [
      c.caption,
      c.hashtags.length > 0 ? c.hashtags.map((h) => `#${h}`).join(' ') : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(platform);
    toast.success(`${PLATFORM_CONFIG[platform].name} content copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentContent = getContent(activeTab);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-deep-600">Preview</label>
        <button
          onClick={() => copyToClipboard(activeTab)}
          className="flex items-center gap-1.5 rounded-lg bg-ocean-100 px-3 py-1.5 text-xs font-medium text-ocean-700 hover:bg-ocean-200"
        >
          {copied === activeTab ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy {PLATFORM_CONFIG[activeTab].name} Content
            </>
          )}
        </button>
      </div>

      <div className="flex gap-1 rounded-xl border border-foam-200 bg-foam-50 p-1">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setActiveTab(platform)}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              activeTab === platform
                ? 'bg-white text-deep-600 shadow-sm'
                : 'text-foam-300 hover:text-deep-600'
            )}
          >
            {PLATFORM_CONFIG[platform].name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-foam-100 p-6">
        {activeTab === 'facebook' && (
          <FacebookPreview content={currentContent} media={media} music={music} />
        )}
        {activeTab === 'instagram' && (
          <InstagramPreview content={currentContent} media={media} music={music} />
        )}
        {activeTab === 'tiktok' && (
          <TikTokPreview content={currentContent} media={media} music={music} />
        )}
      </div>
    </div>
  );
}
