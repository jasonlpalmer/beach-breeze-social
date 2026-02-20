import { Post } from '@/types/post';

const STORAGE_KEY = 'bbx-social-posts';
const BRAND_CONTEXT_KEY = 'bbx-brand-context';

export interface BrandContext {
  businessName: string;
  description: string;
  productsServices: string;
  targetAudience: string;
  brandVoice: string;
}

export const EMPTY_BRAND_CONTEXT: BrandContext = {
  businessName: '',
  description: '',
  productsServices: '',
  targetAudience: '',
  brandVoice: '',
};

export function getBrandContext(): BrandContext {
  if (typeof window === 'undefined') return EMPTY_BRAND_CONTEXT;
  const raw = localStorage.getItem(BRAND_CONTEXT_KEY);
  if (!raw) return EMPTY_BRAND_CONTEXT;
  try {
    return { ...EMPTY_BRAND_CONTEXT, ...JSON.parse(raw) };
  } catch {
    return EMPTY_BRAND_CONTEXT;
  }
}

export function saveBrandContext(context: BrandContext): void {
  localStorage.setItem(BRAND_CONTEXT_KEY, JSON.stringify(context));
}

export function clearBrandContext(): void {
  localStorage.removeItem(BRAND_CONTEXT_KEY);
}

export function formatBrandContextForPrompt(ctx: BrandContext): string | null {
  const parts: string[] = [];
  if (ctx.businessName) parts.push(`Business Name: ${ctx.businessName}`);
  if (ctx.description) parts.push(`About the Business: ${ctx.description}`);
  if (ctx.productsServices) parts.push(`Products/Services: ${ctx.productsServices}`);
  if (ctx.targetAudience) parts.push(`Target Audience: ${ctx.targetAudience}`);
  if (ctx.brandVoice) parts.push(`Brand Voice & Tone: ${ctx.brandVoice}`);
  if (parts.length === 0) return null;
  return parts.join('\n');
}

export function getPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getPost(id: string): Post | null {
  const posts = getPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export function savePost(post: Post): void {
  const posts = getPosts();
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.unshift(post);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function deletePost(id: string): void {
  const posts = getPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
