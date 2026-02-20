'use client';

import { useState } from 'react';
import { Platform, PlatformContent, MediaFile, MusicTrack } from '@/types/post';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Copy, Check, ClipboardCopy, Hash, Download, ExternalLink } from 'lucide-react';
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

const PLATFORM_POST_LINKS: Record<Platform, { label: string; url: string; description: string }> = {
  facebook: {
    label: 'Open Facebook',
    url: 'https://www.facebook.com/',
    description: 'Create a new post on Facebook',
  },
  instagram: {
    label: 'Open Instagram',
    url: 'https://www.instagram.com/',
    description: 'Post via the Instagram app or web',
  },
  tiktok: {
    label: 'Open TikTok',
    url: 'https://www.tiktok.com/upload',
    description: 'Upload directly to TikTok',
  },
};

export default function PlatformPreview({
  platforms,
  content,
  media,
  music,
}: PlatformPreviewProps) {
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

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

  const copyCaption = (platform: Platform) => {
    const c = getContent(platform);
    if (!c.caption) {
      toast.error('No caption to copy');
      return;
    }
    navigator.clipboard.writeText(c.caption);
    setCopiedType('caption');
    toast.success('Caption copied!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyHashtags = (platform: Platform) => {
    const c = getContent(platform);
    if (c.hashtags.length === 0) {
      toast.error('No hashtags to copy');
      return;
    }
    const tags = c.hashtags.map((h) => `#${h}`).join(' ');
    navigator.clipboard.writeText(tags);
    setCopiedType('hashtags');
    toast.success('Hashtags copied!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyAll = (platform: Platform) => {
    const c = getContent(platform);
    const text = [
      c.caption,
      c.hashtags.length > 0 ? c.hashtags.map((h) => `#${h}`).join(' ') : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    if (!text) {
      toast.error('No content to copy');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedType('all');
    toast.success(`${PLATFORM_CONFIG[platform].name} content copied!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadMedia = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name || `media-${file.id}.${file.mimeType.split('/')[1] || 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${file.name}...`);
  };

  const currentContent = getContent(activeTab);
  const platformLink = PLATFORM_POST_LINKS[activeTab];

  return (
    <div className="space-y-4">
      {/* Platform tabs */}
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

      {/* Preview */}
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

      {/* Quick Actions Toolbar */}
      <div className="rounded-2xl border border-foam-200 bg-white p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foam-300">
          Quick Actions
        </h4>

        {/* Copy buttons row */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            onClick={() => copyCaption(activeTab)}
            disabled={!currentContent.caption}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              currentContent.caption
                ? 'bg-ocean-50 text-ocean-700 hover:bg-ocean-100'
                : 'cursor-not-allowed bg-foam-50 text-foam-300'
            )}
          >
            {copiedType === 'caption' ? (
              <><Check size={14} /> Copied!</>
            ) : (
              <><ClipboardCopy size={14} /> Copy Caption</>
            )}
          </button>

          <button
            onClick={() => copyHashtags(activeTab)}
            disabled={currentContent.hashtags.length === 0}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              currentContent.hashtags.length > 0
                ? 'bg-coral-50 text-coral-600 hover:bg-coral-100'
                : 'cursor-not-allowed bg-foam-50 text-foam-300'
            )}
          >
            {copiedType === 'hashtags' ? (
              <><Check size={14} /> Copied!</>
            ) : (
              <><Hash size={14} /> Copy Hashtags</>
            )}
          </button>

          <button
            onClick={() => copyAll(activeTab)}
            disabled={!currentContent.caption && currentContent.hashtags.length === 0}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              currentContent.caption || currentContent.hashtags.length > 0
                ? 'bg-deep-600 text-white hover:bg-deep-700'
                : 'cursor-not-allowed bg-foam-50 text-foam-300'
            )}
          >
            {copiedType === 'all' ? (
              <><Check size={14} /> Copied!</>
            ) : (
              <><Copy size={14} /> Copy All</>
            )}
          </button>
        </div>

        {/* Download media row */}
        {media.length > 0 && (
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-medium text-foam-300">Download Media</p>
            <div className="flex flex-wrap gap-2">
              {media.map((file, idx) => (
                <button
                  key={file.id}
                  onClick={() => downloadMedia(file)}
                  className="flex items-center gap-1.5 rounded-lg bg-sand-50 px-3 py-2 text-xs font-medium text-sand-600 hover:bg-sand-100"
                >
                  <Download size={14} />
                  {media.length === 1
                    ? `Download ${file.type === 'image' ? 'Image' : 'Video'}`
                    : `${file.type === 'image' ? 'Image' : 'Video'} ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Post to platform link */}
        <div className="border-t border-foam-100 pt-3">
          <a
            href={platformLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: PLATFORM_CONFIG[activeTab].bgColor,
              color: PLATFORM_CONFIG[activeTab].color,
            }}
          >
            <ExternalLink size={16} />
            {platformLink.label} to Post
            <span className="ml-auto text-xs font-normal opacity-70">
              {platformLink.description}
            </span>
          </a>
        </div>
      </div>

      {/* Posting Guide */}
      <div className="rounded-2xl border border-foam-200 bg-gradient-to-r from-ocean-50 to-foam-50 p-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ocean-600">
          How to Post to {PLATFORM_CONFIG[activeTab].name}
        </h4>
        {activeTab === 'facebook' && (
          <ol className="space-y-1 text-xs text-deep-600">
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">1.</span>
              Click &quot;Copy All&quot; above to copy your caption &amp; hashtags
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">2.</span>
              Download your media if you have images or video
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">3.</span>
              Click &quot;Open Facebook to Post&quot; — click &quot;What&apos;s on your mind?&quot;
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">4.</span>
              Paste your content, add your media, and hit Post!
            </li>
          </ol>
        )}
        {activeTab === 'instagram' && (
          <ol className="space-y-1 text-xs text-deep-600">
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">1.</span>
              Click &quot;Copy All&quot; above to copy your caption &amp; hashtags
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">2.</span>
              Download your media if you have images or video
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">3.</span>
              Open Instagram on your phone or click &quot;Open Instagram to Post&quot;
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">4.</span>
              Tap the + button, select your media, paste the caption, and share!
            </li>
          </ol>
        )}
        {activeTab === 'tiktok' && (
          <ol className="space-y-1 text-xs text-deep-600">
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">1.</span>
              Click &quot;Copy All&quot; above to copy your caption &amp; hashtags
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">2.</span>
              Download your video (TikTok requires video content)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">3.</span>
              Click &quot;Open TikTok to Post&quot; to go to TikTok&apos;s upload page
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-ocean-500">4.</span>
              Upload your video, paste the caption &amp; hashtags, and post!
            </li>
          </ol>
        )}
      </div>
    </div>
  );
}
