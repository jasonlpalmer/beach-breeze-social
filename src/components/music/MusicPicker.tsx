'use client';

import { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Music, Library, Upload, ArrowLeft } from 'lucide-react';
import { MusicTrack } from '@/types/post';
import { AUDIO_MAX_SIZE, AUDIO_ACCEPT_TYPES } from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';
import AudioPlayer from './AudioPlayer';
import MusicLibrary from './MusicLibrary';

interface MusicPickerProps {
  music: MusicTrack | null;
  onMusicChange: (music: MusicTrack | null) => void;
}

type Mode = 'idle' | 'library' | 'selected';

export default function MusicPicker({
  music,
  onMusicChange,
}: MusicPickerProps) {
  const [mode, setMode] = useState<Mode>(music ? 'selected' : 'idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLibrarySelect = useCallback(
    (track: MusicTrack) => {
      onMusicChange(track);
      setMode('selected');
      toast.success(`Selected "${track.title}"`);
    },
    [onMusicChange]
  );

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validExtensions = AUDIO_ACCEPT_TYPES['audio/*'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validExtensions.includes(ext)) {
        toast.error('Unsupported audio format. Use MP3, WAV, OGG, AAC, or M4A.');
        return;
      }

      // Validate file size
      if (file.size > AUDIO_MAX_SIZE) {
        toast.error(`File too large. Maximum size is ${formatFileSize(AUDIO_MAX_SIZE)}.`);
        return;
      }

      // Warn about large files in localStorage
      if (file.size > 2 * 1024 * 1024) {
        toast.warning('Large audio file - may impact storage. Consider a shorter clip.');
      }

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;

        // Get audio duration using a temporary audio element
        const audio = new Audio(url);
        audio.addEventListener('loadedmetadata', () => {
          const track: MusicTrack = {
            id: uuidv4(),
            title: file.name.replace(/\.[^.]+$/, ''),
            artist: 'My Upload',
            duration: audio.duration,
            mood: 'beach-vibes',
            source: 'upload',
            url,
            mimeType: file.type,
            size: file.size,
          };
          onMusicChange(track);
          setMode('selected');
          toast.success(`Uploaded "${track.title}"`);
        });
        audio.addEventListener('error', () => {
          toast.error('Could not read audio file.');
        });
      };
      reader.readAsDataURL(file);

      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    [onMusicChange]
  );

  const handleRemove = useCallback(() => {
    onMusicChange(null);
    setMode('idle');
    toast.success('Music removed');
  }, [onMusicChange]);

  // Hidden file input
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept={AUDIO_ACCEPT_TYPES['audio/*'].join(',')}
      onChange={handleUpload}
      className="hidden"
    />
  );

  // Idle state - show prompt
  if (mode === 'idle' && !music) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-deep-600">Music</label>
        <div className="rounded-2xl border-2 border-dashed border-foam-200 bg-white p-6 text-center">
          {fileInput}
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-100">
            <Music size={24} className="text-ocean-500" />
          </div>
          <p className="mb-1 font-display text-sm font-semibold text-deep-600">
            Add Music to Your Post
          </p>
          <p className="mb-4 text-xs text-foam-300">
            Choose from our library or upload your own audio
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setMode('library')}
              className="flex items-center gap-2 rounded-xl bg-ocean-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ocean-600"
            >
              <Library size={16} />
              Browse Library
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-foam-200 bg-white px-4 py-2.5 text-sm font-semibold text-deep-600 hover:bg-foam-50"
            >
              <Upload size={16} />
              Upload Audio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Library browser
  if (mode === 'library') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-deep-600">
            Music Library
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-foam-100 px-3 py-1.5 text-xs font-medium text-deep-600 hover:bg-foam-200"
            >
              <Upload size={14} />
              Upload
            </button>
            <button
              onClick={() => setMode(music ? 'selected' : 'idle')}
              className="flex items-center gap-1.5 rounded-lg bg-foam-100 px-3 py-1.5 text-xs font-medium text-foam-300 hover:bg-foam-200"
            >
              <ArrowLeft size={14} />
              {music ? 'Back' : 'Close'}
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-foam-200 bg-white p-4">
          {fileInput}
          <MusicLibrary
            onSelect={handleLibrarySelect}
            selectedTrackId={music?.id}
          />
        </div>
      </div>
    );
  }

  // Selected state - show player
  if (music) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-deep-600">Music</label>
        {fileInput}
        <AudioPlayer track={music} onRemove={handleRemove} />
        <div className="flex gap-2">
          <button
            onClick={() => setMode('library')}
            className="flex items-center gap-1.5 rounded-lg bg-ocean-100 px-3 py-1.5 text-xs font-medium text-ocean-700 hover:bg-ocean-200"
          >
            <Library size={14} />
            Change Track
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg bg-foam-100 px-3 py-1.5 text-xs font-medium text-deep-600 hover:bg-foam-200"
          >
            <Upload size={14} />
            Upload Different
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
