'use client';

import { Platform } from '@/types/post';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Music } from 'lucide-react';

const platformIcons: Record<Platform, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music,
};

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export default function PlatformSelector({
  selected,
  onChange,
}: PlatformSelectorProps) {
  const toggle = (platform: Platform) => {
    if (selected.includes(platform)) {
      if (selected.length > 1) {
        onChange(selected.filter((p) => p !== platform));
      }
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-deep-600">
        Target Platforms
      </label>
      <div className="flex flex-wrap gap-3">
        {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          const Icon = platformIcons[platform];
          const isSelected = selected.includes(platform);

          return (
            <button
              key={platform}
              type="button"
              onClick={() => toggle(platform)}
              className={cn(
                'flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                isSelected
                  ? 'border-current shadow-sm'
                  : 'border-foam-200 text-foam-300 hover:border-foam-300'
              )}
              style={
                isSelected
                  ? { color: config.color, backgroundColor: config.bgColor }
                  : undefined
              }
            >
              <Icon size={18} />
              {config.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
