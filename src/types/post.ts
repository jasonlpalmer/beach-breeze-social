export type Platform = 'facebook' | 'instagram' | 'tiktok';

export type PostStatus = 'draft' | 'ready' | 'posted';

export interface PlatformContent {
  platform: Platform;
  caption: string;
  hashtags: string[];
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
}

export type MusicMood = 'beach-vibes' | 'energetic' | 'chill' | 'upbeat' | 'tropical' | 'sunset';

export type MusicSource = 'library' | 'upload';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: MusicMood;
  bpm?: number;
  source: MusicSource;
  url: string;
  mimeType: string;
  size?: number;
}

export interface Post {
  id: string;
  title: string;
  platforms: Platform[];
  content: PlatformContent[];
  media: MediaFile[];
  music: MusicTrack | null;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}
