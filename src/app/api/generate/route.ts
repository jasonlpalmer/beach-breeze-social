import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompts';
import { GenerateRequest, GenerateResponse } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const apiKey =
      request.headers.get('x-api-key') || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key configured. Add your Anthropic API key in Settings.' },
        { status: 401 }
      );
    }

    const body: GenerateRequest = await request.json();
    const { platforms, topic, existingDraft, mediaDescription, tone, brandContext } = body;

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });
    const prompt = buildPrompt(
      platforms,
      topic,
      existingDraft,
      mediaDescription,
      tone,
      brandContext
    );

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      );
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonText = textBlock.text;
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed: GenerateResponse = JSON.parse(jsonText);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
