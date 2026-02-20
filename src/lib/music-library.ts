import { MusicTrack, MusicMood } from '@/types/post';

export interface MusicCategory {
  mood: MusicMood;
  label: string;
  description: string;
}

export const MUSIC_CATEGORIES: MusicCategory[] = [
  { mood: 'beach-vibes', label: 'Beach Vibes', description: 'Laid-back coastal sounds' },
  { mood: 'energetic', label: 'Energetic', description: 'High energy and pump-up' },
  { mood: 'chill', label: 'Chill', description: 'Relaxed and mellow' },
  { mood: 'upbeat', label: 'Upbeat', description: 'Happy and positive' },
  { mood: 'tropical', label: 'Tropical', description: 'Island-inspired rhythms' },
  { mood: 'sunset', label: 'Sunset', description: 'Warm evening ambience' },
];

export const LIBRARY_TRACKS: Omit<MusicTrack, 'url'>[] = [
  {
    id: 'lib-001',
    title: 'Ocean Waves Groove',
    artist: 'Beach Breeze Studio',
    duration: 30,
    mood: 'beach-vibes',
    bpm: 100,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-002',
    title: 'Sandy Shores',
    artist: 'Beach Breeze Studio',
    duration: 25,
    mood: 'beach-vibes',
    bpm: 95,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-003',
    title: 'Surf Energy',
    artist: 'Beach Breeze Studio',
    duration: 30,
    mood: 'energetic',
    bpm: 128,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-004',
    title: 'Wave Runner',
    artist: 'Beach Breeze Studio',
    duration: 28,
    mood: 'energetic',
    bpm: 140,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-005',
    title: 'Driftwood Dreams',
    artist: 'Beach Breeze Studio',
    duration: 30,
    mood: 'chill',
    bpm: 80,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-006',
    title: 'Low Tide Lounge',
    artist: 'Beach Breeze Studio',
    duration: 32,
    mood: 'chill',
    bpm: 75,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-007',
    title: 'Sunny Side Up',
    artist: 'Beach Breeze Studio',
    duration: 25,
    mood: 'upbeat',
    bpm: 120,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-008',
    title: 'Good Vibes Only',
    artist: 'Beach Breeze Studio',
    duration: 30,
    mood: 'upbeat',
    bpm: 115,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-009',
    title: 'Island Rhythm',
    artist: 'Beach Breeze Studio',
    duration: 30,
    mood: 'tropical',
    bpm: 110,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-010',
    title: 'Paradise Percussion',
    artist: 'Beach Breeze Studio',
    duration: 28,
    mood: 'tropical',
    bpm: 105,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-011',
    title: 'Golden Hour',
    artist: 'Beach Breeze Studio',
    duration: 30,
    mood: 'sunset',
    bpm: 85,
    source: 'library',
    mimeType: 'audio/wav',
  },
  {
    id: 'lib-012',
    title: 'Twilight Waves',
    artist: 'Beach Breeze Studio',
    duration: 35,
    mood: 'sunset',
    bpm: 78,
    source: 'library',
    mimeType: 'audio/wav',
  },
];

// Mood-to-audio parameter mapping for generating distinguishable placeholder sounds
const MOOD_AUDIO_PARAMS: Record<MusicMood, { baseFreq: number; notePattern: number[]; tempo: number }> = {
  'beach-vibes': { baseFreq: 261.63, notePattern: [1, 1.25, 1.5, 1.25], tempo: 0.5 },
  'energetic':   { baseFreq: 329.63, notePattern: [1, 1.5, 1, 1.33, 1.5, 1], tempo: 0.25 },
  'chill':       { baseFreq: 220.00, notePattern: [1, 1.2, 1.5, 1.2], tempo: 0.7 },
  'upbeat':      { baseFreq: 293.66, notePattern: [1, 1.33, 1.5, 1.33, 1.25], tempo: 0.35 },
  'tropical':    { baseFreq: 349.23, notePattern: [1, 1.25, 1, 1.5, 1.25, 1], tempo: 0.3 },
  'sunset':      { baseFreq: 196.00, notePattern: [1, 1.125, 1.25, 1.5], tempo: 0.8 },
};

// Audio URL cache to avoid regenerating
const audioCache = new Map<string, string>();

export async function generatePlaceholderAudio(
  trackId: string,
  mood: MusicMood,
  durationSeconds: number
): Promise<string> {
  const cached = audioCache.get(trackId);
  if (cached) return cached;

  const sampleRate = 22050;
  const totalSamples = sampleRate * Math.min(durationSeconds, 10); // Cap at 10s for performance
  const params = MOOD_AUDIO_PARAMS[mood];

  const offlineCtx = new OfflineAudioContext(1, totalSamples, sampleRate);

  let currentTime = 0;
  let noteIndex = 0;

  while (currentTime < Math.min(durationSeconds, 10)) {
    const freq = params.baseFreq * params.notePattern[noteIndex % params.notePattern.length];
    const noteDuration = params.tempo;

    // Create oscillator for this note
    const osc = offlineCtx.createOscillator();
    osc.type = mood === 'energetic' || mood === 'upbeat' ? 'square' : 'sine';
    osc.frequency.setValueAtTime(freq, currentTime);

    // Envelope for smooth note transitions
    const gain = offlineCtx.createGain();
    gain.gain.setValueAtTime(0, currentTime);
    gain.gain.linearRampToValueAtTime(0.15, currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0.1, currentTime + noteDuration * 0.7);
    gain.gain.linearRampToValueAtTime(0, currentTime + noteDuration);

    osc.connect(gain);
    gain.connect(offlineCtx.destination);

    osc.start(currentTime);
    osc.stop(currentTime + noteDuration);

    currentTime += noteDuration;
    noteIndex++;
  }

  const audioBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(audioBuffer);
  const url = URL.createObjectURL(wavBlob);

  audioCache.set(trackId, url);
  return url;
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write audio data
  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += bytesPerSample;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function getLibraryTrack(id: string): (Omit<MusicTrack, 'url'>) | undefined {
  return LIBRARY_TRACKS.find((t) => t.id === id);
}
