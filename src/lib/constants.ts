import { Platform } from '@/types/post';

export const PLATFORM_CONFIG: Record<Platform, {
  name: string;
  maxCaptionLength: number;
  recommendedCaptionLength: number;
  maxHashtags: number;
  color: string;
  bgColor: string;
}> = {
  facebook: {
    name: 'Facebook',
    maxCaptionLength: 63206,
    recommendedCaptionLength: 80,
    maxHashtags: 2,
    color: '#1877F2',
    bgColor: '#E7F3FF',
  },
  instagram: {
    name: 'Instagram',
    maxCaptionLength: 2200,
    recommendedCaptionLength: 125,
    maxHashtags: 5,
    color: '#E4405F',
    bgColor: '#FDEEF1',
  },
  tiktok: {
    name: 'TikTok',
    maxCaptionLength: 4000,
    recommendedCaptionLength: 150,
    maxHashtags: 8,
    color: '#000000',
    bgColor: '#F0F0F0',
  },
};

export const AUDIO_MAX_SIZE = 20 * 1024 * 1024; // 20MB
export const AUDIO_ACCEPT_TYPES = {
  'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.m4a'],
};
