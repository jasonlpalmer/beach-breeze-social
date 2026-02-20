'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Platform, PlatformContent, MediaFile, MusicTrack, Post, PostStatus } from '@/types/post';
import { PlatformSuggestion, GenerateRequest } from '@/types/ai';
import { savePost, getBrandContext, formatBrandContextForPrompt } from '@/lib/storage';
import PlatformSelector from './PlatformSelector';
import ContentEditor from './ContentEditor';
import PlatformPreview from './PlatformPreview';
import MediaUploader from '@/components/media/MediaUploader';
import MusicPicker from '@/components/music/MusicPicker';
import GenerateButton from '@/components/ai/GenerateButton';
import AiSuggestionPanel from '@/components/ai/AiSuggestionPanel';

interface PostCreatorProps {
  existingPost?: Post;
}

export default function PostCreator({ existingPost }: PostCreatorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(existingPost?.title || '');
  const [platforms, setPlatforms] = useState<Platform[]>(
    existingPost?.platforms || ['instagram']
  );
  const [media, setMedia] = useState<MediaFile[]>(existingPost?.media || []);
  const [music, setMusic] = useState<MusicTrack | null>(existingPost?.music || null);
  const [content, setContent] = useState<PlatformContent[]>(
    existingPost?.content || []
  );
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlatformSuggestion[]>([]);
  const [titleSuggestion, setTitleSuggestion] = useState<string | undefined>();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<GenerateRequest['tone']>('fun');

  const generateContent = async () => {
    setAiLoading(true);
    try {
      const apiKey = localStorage.getItem('bbx-anthropic-key') || '';
      const brandCtx = getBrandContext();
      const brandContextStr = formatBrandContextForPrompt(brandCtx) || undefined;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {}),
        },
        body: JSON.stringify({
          platforms,
          topic: topic || title || undefined,
          existingDraft: content.find((c) => c.caption)?.caption || undefined,
          tone,
          brandContext: brandContextStr,
        } satisfies GenerateRequest),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setTitleSuggestion(data.titleSuggestion || undefined);
      toast.success('AI suggestions ready!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      toast.error(message);
    } finally {
      setAiLoading(false);
    }
  };

  const acceptSuggestion = (suggestion: PlatformSuggestion) => {
    const existing = content.filter((c) => c.platform !== suggestion.platform);
    setContent([
      ...existing,
      {
        platform: suggestion.platform,
        caption: suggestion.caption,
        hashtags: suggestion.hashtags,
      },
    ]);
    toast.success(`${suggestion.platform} content applied`);
  };

  const acceptTitleSuggestion = (suggestedTitle: string) => {
    setTitle(suggestedTitle);
    setTitleSuggestion(undefined);
    toast.success('Title applied!');
  };

  const acceptAllSuggestions = () => {
    const newContent = [...content];
    suggestions.forEach((s) => {
      const idx = newContent.findIndex((c) => c.platform === s.platform);
      const entry: PlatformContent = {
        platform: s.platform,
        caption: s.caption,
        hashtags: s.hashtags,
      };
      if (idx >= 0) {
        newContent[idx] = entry;
      } else {
        newContent.push(entry);
      }
    });
    setContent(newContent);
    if (titleSuggestion) {
      setTitle(titleSuggestion);
      setTitleSuggestion(undefined);
    }
    setSuggestions([]);
    toast.success('All suggestions applied!');
  };

  const handleSave = (status: PostStatus) => {
    const post: Post = {
      id: existingPost?.id || uuidv4(),
      title: title || 'Untitled Post',
      platforms,
      content,
      media,
      music,
      status,
      createdAt: existingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePost(post);
    toast.success(
      status === 'draft' ? 'Saved as draft!' : 'Post marked as ready!'
    );
    router.push('/dashboard/posts');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-deep-600">Post Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your post an internal title..."
          className="w-full rounded-xl border border-foam-200 bg-white px-4 py-3 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
        />
      </div>

      <PlatformSelector selected={platforms} onChange={setPlatforms} />

      <MediaUploader media={media} onMediaChange={setMedia} />

      <MusicPicker music={music} onMusicChange={setMusic} />

      {/* AI Generation Controls */}
      <div className="rounded-2xl border border-foam-200 bg-white p-5">
        <h3 className="mb-4 font-display text-sm font-bold text-deep-600">
          AI Content Generator
        </h3>
        <div className="mb-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Post Direction
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tell the AI what this post should be about. Be as specific as you like!&#10;&#10;Examples:&#10;• Announce our new puppy training program starting March 1st&#10;• Share photos from last weekend's beach play day with the boxers&#10;• Promote our holiday boarding special — 20% off for bookings before Dec 15"
              rows={4}
              className="w-full resize-none rounded-lg border border-foam-200 px-3 py-2 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>
          <div className="w-48">
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as GenerateRequest['tone'])}
              className="w-full rounded-lg border border-foam-200 px-3 py-2 text-sm text-deep-600 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            >
              <option value="fun">Fun & Playful</option>
              <option value="casual">Casual & Relaxed</option>
              <option value="professional">Professional</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>
        </div>
        <GenerateButton loading={aiLoading} onClick={generateContent} />
      </div>

      <AiSuggestionPanel
        suggestions={suggestions}
        titleSuggestion={titleSuggestion}
        onAccept={acceptSuggestion}
        onAcceptTitle={acceptTitleSuggestion}
        onAcceptAll={acceptAllSuggestions}
        onRegenerate={generateContent}
        loading={aiLoading}
      />

      <ContentEditor
        platforms={platforms}
        content={content}
        onChange={setContent}
      />

      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 rounded-xl border border-foam-200 bg-white px-4 py-2.5 text-sm font-medium text-deep-600 hover:bg-foam-50"
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            className="flex items-center gap-2 rounded-xl border border-foam-200 bg-white px-5 py-2.5 text-sm font-semibold text-deep-600 hover:bg-foam-50"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('ready')}
            className="flex items-center gap-2 rounded-xl bg-ocean-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ocean-600"
          >
            <Save size={18} />
            Mark Ready
          </button>
        </div>
      </div>

      {showPreview && (
        <PlatformPreview
          platforms={platforms}
          content={content}
          media={media}
          music={music}
        />
      )}
    </div>
  );
}
