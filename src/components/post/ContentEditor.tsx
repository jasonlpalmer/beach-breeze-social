'use client';

import { useState } from 'react';
import { Platform, PlatformContent } from '@/types/post';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Hash, X } from 'lucide-react';

interface ContentEditorProps {
  platforms: Platform[];
  content: PlatformContent[];
  onChange: (content: PlatformContent[]) => void;
}

export default function ContentEditor({
  platforms,
  content,
  onChange,
}: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0]);
  const [hashtagInput, setHashtagInput] = useState('');

  if (!platforms.includes(activeTab)) {
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

  const updateContent = (platform: Platform, updates: Partial<PlatformContent>) => {
    const existing = content.find((c) => c.platform === platform);
    if (existing) {
      onChange(
        content.map((c) =>
          c.platform === platform ? { ...c, ...updates } : c
        )
      );
    } else {
      onChange([
        ...content,
        { platform, caption: '', hashtags: [], ...updates },
      ]);
    }
  };

  const addHashtag = (platform: Platform) => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (!tag) return;
    const current = getContent(platform);
    if (!current.hashtags.includes(tag)) {
      updateContent(platform, { hashtags: [...current.hashtags, tag] });
    }
    setHashtagInput('');
  };

  const removeHashtag = (platform: Platform, tag: string) => {
    const current = getContent(platform);
    updateContent(platform, {
      hashtags: current.hashtags.filter((h) => h !== tag),
    });
  };

  const currentContent = getContent(activeTab);
  const config = PLATFORM_CONFIG[activeTab];
  const charCount = currentContent.caption.length;
  const isOverLimit = charCount > config.maxCaptionLength;
  const isNearRecommended = charCount > config.recommendedCaptionLength;

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-deep-600">Post Content</label>

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

      <div className="rounded-2xl border border-foam-200 bg-white">
        <textarea
          value={currentContent.caption}
          onChange={(e) =>
            updateContent(activeTab, { caption: e.target.value })
          }
          placeholder={`Write your ${config.name} caption...`}
          rows={5}
          className="w-full resize-none rounded-t-2xl border-0 p-4 text-sm text-deep-600 placeholder:text-foam-300 focus:outline-none focus:ring-0"
        />
        <div className="flex items-center justify-between border-t border-foam-100 px-4 py-2">
          <span
            className={cn(
              'text-xs font-medium',
              isOverLimit
                ? 'text-red-500'
                : isNearRecommended
                ? 'text-sand-500'
                : 'text-foam-300'
            )}
          >
            {charCount} / {config.maxCaptionLength}
            {isNearRecommended && !isOverLimit && (
              <span className="ml-1">
                (recommended: {config.recommendedCaptionLength})
              </span>
            )}
          </span>
          <span className="text-xs text-foam-300">
            {config.maxHashtags} hashtags recommended
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Hash
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foam-300"
            />
            <input
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHashtag(activeTab);
                }
              }}
              placeholder="Add hashtag..."
              className="w-full rounded-xl border border-foam-200 bg-white py-2 pl-9 pr-4 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>
          <button
            onClick={() => addHashtag(activeTab)}
            className="rounded-xl bg-ocean-100 px-4 py-2 text-sm font-medium text-ocean-700 hover:bg-ocean-200"
          >
            Add
          </button>
        </div>

        {currentContent.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {currentContent.hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-lg bg-ocean-50 px-2.5 py-1 text-sm text-ocean-700"
              >
                #{tag}
                <button
                  onClick={() => removeHashtag(activeTab, tag)}
                  className="rounded-full p-0.5 hover:bg-ocean-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
