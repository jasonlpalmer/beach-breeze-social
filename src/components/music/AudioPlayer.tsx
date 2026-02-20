'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, X, Music } from 'lucide-react';
import { MusicTrack } from '@/types/post';
import { cn, formatDuration } from '@/lib/utils';

interface AudioPlayerProps {
  track: MusicTrack;
  compact?: boolean;
  onRemove?: () => void;
  className?: string;
  audioUrl?: string;
}

export default function AudioPlayer({
  track,
  compact = false,
  onRemove,
  className,
  audioUrl,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration);

  const src = audioUrl || track.url;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  // Stop playback when src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying, src]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          onClick={togglePlay}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean-100 text-ocean-600 hover:bg-ocean-200"
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-deep-600">{track.title}</p>
          <p className="truncate text-xs text-foam-300">{track.artist}</p>
        </div>
        <span className="shrink-0 text-xs text-foam-300">
          {formatDuration(duration)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-foam-200 bg-white p-4',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-start gap-3">
        {/* Play button */}
        <button
          onClick={togglePlay}
          disabled={!src}
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors',
            src
              ? 'bg-ocean-500 text-white hover:bg-ocean-600'
              : 'bg-foam-200 text-foam-300'
          )}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        {/* Track info + progress */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-deep-600">
                {track.title}
              </p>
              <p className="truncate text-xs text-foam-300">{track.artist}</p>
            </div>
            {onRemove && (
              <button
                onClick={onRemove}
                className="shrink-0 rounded-lg p-1 text-foam-300 hover:bg-red-50 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="mt-2 h-1.5 cursor-pointer rounded-full bg-foam-100"
            onClick={seek}
          >
            <div
              className="h-full rounded-full bg-ocean-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time + metadata */}
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-foam-300">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
            <div className="flex items-center gap-2">
              {track.bpm && (
                <span className="text-xs text-foam-300">{track.bpm} BPM</span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-ocean-50 px-1.5 py-0.5 text-xs text-ocean-600">
                <Music size={10} />
                {track.mood.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
