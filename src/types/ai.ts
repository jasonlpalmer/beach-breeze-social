import { Platform } from './post';

export interface GenerateRequest {
  platforms: Platform[];
  topic?: string;
  existingDraft?: string;
  mediaDescription?: string;
  tone?: 'casual' | 'professional' | 'fun' | 'inspirational';
  brandContext?: string;
}

export interface PlatformSuggestion {
  platform: Platform;
  caption: string;
  hashtags: string[];
}

export interface GenerateResponse {
  titleSuggestion?: string;
  suggestions: PlatformSuggestion[];
}
