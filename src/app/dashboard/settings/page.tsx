'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Key, Save, Facebook, Instagram, Music, Building2, Trash2, ExternalLink, Copy } from 'lucide-react';
import Image from 'next/image';
import {
  BrandContext,
  EMPTY_BRAND_CONTEXT,
  getBrandContext,
  saveBrandContext,
  clearBrandContext,
} from '@/lib/storage';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [brand, setBrand] = useState<BrandContext>(EMPTY_BRAND_CONTEXT);

  useEffect(() => {
    const savedKey = localStorage.getItem('bbx-anthropic-key');
    if (savedKey) setApiKey(savedKey);
    setBrand(getBrandContext());
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('bbx-anthropic-key', apiKey);
    toast.success('API key saved!');
  };

  const handleClearKey = () => {
    localStorage.removeItem('bbx-anthropic-key');
    setApiKey('');
    toast.success('API key cleared');
  };

  const handleSaveBrand = () => {
    saveBrandContext(brand);
    toast.success('Brand profile saved!');
  };

  const handleClearBrand = () => {
    clearBrandContext();
    setBrand(EMPTY_BRAND_CONTEXT);
    toast.success('Brand profile cleared');
  };

  const updateBrand = (field: keyof BrandContext, value: string) => {
    setBrand((prev) => ({ ...prev, [field]: value }));
  };

  const hasBrandContent = Object.values(brand).some((v) => v.trim() !== '');

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Brand Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Beach Breeze Boxers"
            width={64}
            height={64}
            className="rounded-xl"
          />
          <div>
            <h3 className="font-display text-lg font-bold text-deep-600">
              Beach Breeze Boxers
            </h3>
            <p className="text-sm text-foam-300">
              Social Media Manager
            </p>
          </div>
        </div>
      </div>

      {/* Brand Profile */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-50">
            <Building2 size={20} className="text-coral-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-deep-600">
              Brand Profile
            </h3>
            <p className="text-xs text-foam-300">
              Tell the AI about your business so it creates better content
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Business Name
            </label>
            <input
              type="text"
              value={brand.businessName}
              onChange={(e) => updateBrand('businessName', e.target.value)}
              placeholder="e.g., Beach Breeze Boxers"
              className="w-full rounded-xl border border-foam-200 bg-foam-50 px-4 py-3 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Business Description
            </label>
            <textarea
              value={brand.description}
              onChange={(e) => updateBrand('description', e.target.value)}
              placeholder="Describe what your business is and what it does. e.g., Beach Breeze Boxers is a dog kennel specializing in boxer breed dogs. We provide boarding, daycare, training, and grooming services in a fun beach-themed environment..."
              rows={4}
              className="w-full resize-none rounded-xl border border-foam-200 bg-foam-50 px-4 py-3 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Products / Services
            </label>
            <textarea
              value={brand.productsServices}
              onChange={(e) => updateBrand('productsServices', e.target.value)}
              placeholder="List what you offer. e.g., Dog boarding (overnight stays), doggy daycare, puppy training classes, grooming & spa services, beach play sessions, socialization groups..."
              rows={3}
              className="w-full resize-none rounded-xl border border-foam-200 bg-foam-50 px-4 py-3 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Target Audience
            </label>
            <textarea
              value={brand.targetAudience}
              onChange={(e) => updateBrand('targetAudience', e.target.value)}
              placeholder="Who are your customers? e.g., Boxer dog owners and enthusiasts, active pet parents who want premium care for their dogs, local families looking for reliable dog boarding and daycare..."
              rows={3}
              className="w-full resize-none rounded-xl border border-foam-200 bg-foam-50 px-4 py-3 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-deep-600">
              Brand Voice & Tone
            </label>
            <textarea
              value={brand.brandVoice}
              onChange={(e) => updateBrand('brandVoice', e.target.value)}
              placeholder="How should your brand sound? e.g., Warm, fun, and playful with a beach vibe. We love dogs and it shows! Use casual language, dog puns welcome. Think friendly neighbor who happens to be a dog expert..."
              rows={3}
              className="w-full resize-none rounded-xl border border-foam-200 bg-foam-50 px-4 py-3 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSaveBrand}
              className="flex items-center gap-2 rounded-xl bg-ocean-500 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-600"
            >
              <Save size={16} />
              Save Brand Profile
            </button>
            {hasBrandContent && (
              <button
                onClick={handleClearBrand}
                className="flex items-center gap-2 rounded-xl border border-foam-200 px-4 py-2 text-sm font-medium text-foam-300 hover:bg-foam-50"
              >
                <Trash2 size={16} />
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-foam-300">
            This information is sent to the AI with every content generation request to produce on-brand results. Stored locally on your device.
          </p>
        </div>
      </div>

      {/* API Key */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100">
            <Key size={20} className="text-ocean-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-deep-600">
              Anthropic API Key
            </h3>
            <p className="text-xs text-foam-300">
              Required for AI content generation
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full rounded-xl border border-foam-200 bg-foam-50 px-4 py-3 pr-20 text-sm text-deep-600 placeholder:text-foam-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ocean-500 hover:text-ocean-600"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveKey}
              className="flex items-center gap-2 rounded-xl bg-ocean-500 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-600"
            >
              <Save size={16} />
              Save Key
            </button>
            {apiKey && (
              <button
                onClick={handleClearKey}
                className="rounded-xl border border-foam-200 px-4 py-2 text-sm font-medium text-foam-300 hover:bg-foam-50"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-foam-300">
            Your key is stored locally and never shared. Get a key from{' '}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-500 hover:text-ocean-600"
            >
              console.anthropic.com
            </a>
          </p>
        </div>
      </div>

      {/* Platform Posting */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100">
            <Copy size={20} className="text-ocean-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-deep-600">
              Post to Social Media
            </h3>
            <p className="text-xs text-foam-300">
              Copy your content and post directly to each platform
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm text-deep-600">
          Create your content in the app, then use the one-click copy buttons on the preview to paste directly into each platform. Quick links below take you straight to where you need to go:
        </p>

        <div className="space-y-3">
          {[
            {
              name: 'Facebook',
              icon: Facebook,
              color: '#1877F2',
              bgColor: '#E7F3FF',
              url: 'https://www.facebook.com/',
              tip: 'Click "What\'s on your mind?" and paste your content',
            },
            {
              name: 'Instagram',
              icon: Instagram,
              color: '#E4405F',
              bgColor: '#FDEEF1',
              url: 'https://www.instagram.com/',
              tip: 'Tap the + button, add media, and paste your caption',
            },
            {
              name: 'TikTok',
              icon: Music,
              color: '#000000',
              bgColor: '#F0F0F0',
              url: 'https://www.tiktok.com/upload',
              tip: 'Upload your video and paste your caption & hashtags',
            },
          ].map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-foam-200 p-4 transition-colors hover:bg-foam-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  <platform.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-deep-600">
                    {platform.name}
                  </p>
                  <p className="text-xs text-foam-300">{platform.tip}</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-foam-300" />
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-ocean-50 p-3">
          <p className="text-xs text-ocean-700">
            <span className="font-semibold">Tip:</span> Use the &quot;Show Preview&quot; button on the Create Post page to see your content exactly as it will appear on each platform, with one-click copy buttons right there.
          </p>
        </div>
      </div>
    </div>
  );
}
