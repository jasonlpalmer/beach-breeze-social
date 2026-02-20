'use client';

import { PlatformSuggestion } from '@/types/ai';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { Check, RefreshCw, Hash, Type } from 'lucide-react';

interface AiSuggestionPanelProps {
  suggestions: PlatformSuggestion[];
  titleSuggestion?: string;
  onAccept: (suggestion: PlatformSuggestion) => void;
  onAcceptTitle?: (title: string) => void;
  onAcceptAll: () => void;
  onRegenerate: () => void;
  loading: boolean;
}

export default function AiSuggestionPanel({
  suggestions,
  titleSuggestion,
  onAccept,
  onAcceptTitle,
  onAcceptAll,
  onRegenerate,
  loading,
}: AiSuggestionPanelProps) {
  if (suggestions.length === 0 && !titleSuggestion) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-ocean-200 bg-ocean-50/50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-deep-600">
          AI Suggestions
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-ocean-600 shadow-sm hover:bg-ocean-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
          <button
            onClick={onAcceptAll}
            className="flex items-center gap-1.5 rounded-lg bg-ocean-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-ocean-600"
          >
            <Check size={14} />
            Use All
          </button>
        </div>
      </div>

      {/* Title Suggestion */}
      {titleSuggestion && (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-md bg-coral-50 px-2 py-0.5 text-xs font-semibold text-coral-600">
              <Type size={12} />
              Post Title
            </span>
            <button
              onClick={() => onAcceptTitle?.(titleSuggestion)}
              className="flex items-center gap-1 text-xs font-medium text-ocean-500 hover:text-ocean-600"
            >
              <Check size={14} />
              Use This
            </button>
          </div>
          <p className="text-sm font-medium text-deep-600">
            {titleSuggestion}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const config = PLATFORM_CONFIG[suggestion.platform];
          return (
            <div
              key={suggestion.platform}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="rounded-md px-2 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: config.bgColor,
                    color: config.color,
                  }}
                >
                  {config.name}
                </span>
                <button
                  onClick={() => onAccept(suggestion)}
                  className="flex items-center gap-1 text-xs font-medium text-ocean-500 hover:text-ocean-600"
                >
                  <Check size={14} />
                  Use This
                </button>
              </div>
              <p className="mb-2 text-sm text-deep-600 whitespace-pre-wrap">
                {suggestion.caption}
              </p>
              {suggestion.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {suggestion.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 rounded-md bg-ocean-50 px-2 py-0.5 text-xs text-ocean-600"
                    >
                      <Hash size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
