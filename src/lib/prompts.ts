import { Platform } from '@/types/post';

const DEFAULT_BRAND_CONTEXT = `You are a social media content creator. Create engaging, platform-optimized content based on the topic and tone provided. If no specific brand details are given, write general-purpose social media content.`;

export const PLATFORM_RULES: Record<Platform, string> = {
  facebook: `Facebook post rules:
- Keep under 80 characters for maximum engagement, or up to 250 for storytelling
- Use 1-2 targeted hashtags maximum
- Conversational, community-building tone
- Include a call to action when appropriate`,

  instagram: `Instagram caption rules:
- Front-load the hook in the first 125 characters (before the fold)
- Total limit: 2,200 characters
- Use 3-5 highly relevant hashtags
- Mix niche and branded hashtags
- Use line breaks for readability`,

  tiktok: `TikTok caption rules:
- Caption limit: 4,000 characters
- Lead with a hook or question
- Use trending and niche hashtags
- Keep it authentic and energetic
- Include relevant keywords for TikTok SEO`,
};

export function buildPrompt(
  platforms: Platform[],
  topic?: string,
  existingDraft?: string,
  mediaDescription?: string,
  tone: string = 'fun',
  brandContext?: string
): string {
  const contextBlock = brandContext
    ? `You are a social media content creator for the following business:\n\n${brandContext}\n\nUse this brand information to inform your tone, language, and content. Stay true to the brand identity described above.`
    : DEFAULT_BRAND_CONTEXT;

  const platformInstructions = platforms
    .map((p) => PLATFORM_RULES[p])
    .join('\n\n');

  return `${contextBlock}

Generate social media post content for the following platforms: ${platforms.join(', ')}.

${platformInstructions}

${topic ? `Post Direction / Topic:\n${topic}` : ''}
${existingDraft ? `Existing draft to improve: ${existingDraft}` : ''}
${mediaDescription ? `The post includes media: ${mediaDescription}` : ''}
Desired tone: ${tone}

Return your response as valid JSON with this exact structure:
{
  "titleSuggestion": "A short, catchy internal title for this post (5-10 words max)",
  "suggestions": [
    {
      "platform": "platform_name",
      "caption": "the caption text without hashtags",
      "hashtags": ["hashtag1", "hashtag2"]
    }
  ]
}

The "titleSuggestion" should be a concise, descriptive internal title that summarizes the post theme — something a social media manager would use to organize their posts. It should NOT contain hashtags or emojis.

Include one entry per platform requested. Do not include the # symbol in hashtag strings. Make each platform's content unique and optimized for that specific platform.`;
}
