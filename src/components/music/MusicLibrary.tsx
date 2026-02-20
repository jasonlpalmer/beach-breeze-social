'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Check, Music } from 'lucide-react';
import { MusicTrack, MusicMood } from '@/types/post';
import { MUSIC_CATEGORIES, LIBRARY_TRACKS, generatePlaceholderAudio } from '@/lib/music-library';
import { cn, formatDuration } from '@/lib/utils';

interface MusicLibraryProps {
  onSelect: (track: MusicTrack) => void;
  selectedTrackId?: string;
}

const MOOD_COLORS: Record<MusicMood, { bg: string; text: string }> = {
  'beach-vibes': { bg: 'bg-ocean-100', text: 'text-ocean-700' },
  'energetic': { bg: 'bg-coral-400/10', text: 'text-coral-600' },
  'chill': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'upbeat': { bg: 'bg-sand-100', text: 'text-sand-500' },
  'tropical': { bg: 'bg-green-100', text: 'text-green-700' },
  'sunset': { bg: 'bg-orange-100', text: 'text-orange-700' },
};

export default function MusicLibrary({
  onSelect,
  selectedTrackId,
}: MusicLibraryProps) {
  const [activeMood, setActiveMood] = useState<MusicMood | 'all'>('all');
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlCache = useRef<Map<string, string>>(new Map());

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const filteredTracks =
    activeMood === 'all'
      ? LIBRARY_TRACKS
      : LIBRARY_TRACKS.filter((t) => t.mood === activeMood);

  const togglePreview = useCallback(
    async (track: (typeof LIBRARY_TRACKS)[number]) => {
      // If already previewing this track, stop it
      if (previewingId === track.id) {
        audioRef.current?.pause();
        setPreviewingId(null);
        return;
      }

      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Generate audio if not cached
      let url = audioUrlCache.current.get(track.id);
      if (!url) {
        setLoadingId(track.id);
        try {
          url = await generatePlaceholderAudio(track.id, track.mood, track.duration);
          audioUrlCache.current.set(track.id, url);
        } catch {
          setLoadingId(null);
          return;
        }
        setLoadingId(null);
      }

      // Play
      const audio = new Audio(url);
      audio.addEventListener('ended', () => setPreviewingId(null));
      audioRef.current = audio;
      audio.play().catch(() => setPreviewingId(null));
      setPreviewingId(track.id);
    },
    [previewingId]
  );

  const handleSelect = useCallback(
    async (track: (typeof LIBRARY_TRACKS)[number]) => {
      // Stop playback
      if (audioRef.current) {
        audioRef.current.pause();
        setPreviewingId(null);
      }

      // Generate audio URL for the selected track
      let url = audioUrlCache.current.get(track.id);
      if (!url) {
        url = await generatePlaceholderAudio(track.id, track.mood, track.duration);
        audioUrlCache.current.set(track.id, url);
      }

      onSelect({ ...track, url });
    },
    [onSelect]
  );

  return (
    <div className="space-y-4">
      {/* Mood filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveMood('all')}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            activeMood === 'all'
              ? 'bg-deep-600 text-white'
              : 'bg-foam-100 text-foam-300 hover:bg-foam-200'
          )}
        >
          All
        </button>
        {MUSIC_CATEGORIES.map((cat) => {
          const colors = MOOD_COLORS[cat.mood];
          return (
            <button
              key={cat.mood}
              onClick={() => setActiveMood(cat.mood)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                activeMood === cat.mood
                  ? `${colors.bg} ${colors.text}`
                  : 'bg-foam-100 text-foam-300 hover:bg-foam-200'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Track grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filteredTracks.map((track) => {
          const isSelected = selectedTrackId === track.id;
          const isPreviewing = previewingId === track.id;
          const isLoading = loadingId === track.id;
          const colors = MOOD_COLORS[track.mood];

          return (
            <div
              key={track.id}
              className={cn(
                'rounded-xl border p-3 transition-all',
                isSelected
                  ? 'border-ocean-400 bg-ocean-50 ring-1 ring-ocean-400'
                  : 'border-foam-200 bg-white hover:border-foam-300'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Play/pause preview */}
                <button
                  onClick={() => togglePreview(track)}
                  disabled={isLoading}
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                    isPreviewing
                      ? 'bg-ocean-500 text-white'
                      : 'bg-ocean-100 text-ocean-600 hover:bg-ocean-200'
                  )}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-ocean-400 border-t-transparent" />
                  ) : isPreviewing ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} className="ml-0.5" />
                  )}
                </button>

                {/* Track info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-deep-600">
                    {track.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-foam-300">
                      {formatDuration(track.duration)}
                    </span>
                    {track.bpm && (
                      <span className="text-xs text-foam-300">
                        {track.bpm} BPM
                      </span>
                    )}
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-xs',
                        colors.bg,
                        colors.text
                      )}
                    >
                      {track.mood.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Select button */}
                {isSelected ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-500 text-white">
                    <Check size={16} />
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelect(track)}
                    className="rounded-lg bg-ocean-100 px-3 py-1.5 text-xs font-medium text-ocean-700 hover:bg-ocean-200"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTracks.length === 0 && (
        <div className="py-8 text-center">
          <Music size={24} className="mx-auto mb-2 text-foam-300" />
          <p className="text-sm text-foam-300">No tracks in this category</p>
        </div>
      )}
    </div>
  );
}
