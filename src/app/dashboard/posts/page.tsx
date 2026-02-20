'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts, deletePost } from '@/lib/storage';
import { Post, Platform, PostStatus } from '@/types/post';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  FileText,
  Trash2,
  PlusCircle,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filtered = posts.filter((post) => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (platformFilter !== 'all' && !post.platforms.includes(platformFilter))
      return false;
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deletePost(id);
    setPosts(getPosts());
    toast.success('Post deleted');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-foam-300">
          <Filter size={16} />
          <span>Filter:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as PostStatus | 'all')
          }
          className="rounded-lg border border-foam-200 bg-white px-3 py-1.5 text-sm text-deep-600 focus:border-ocean-400 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="draft">Drafts</option>
          <option value="ready">Ready</option>
          <option value="posted">Posted</option>
        </select>
        <select
          value={platformFilter}
          onChange={(e) =>
            setPlatformFilter(e.target.value as Platform | 'all')
          }
          className="rounded-lg border border-foam-200 bg-white px-3 py-1.5 text-sm text-deep-600 focus:border-ocean-400 focus:outline-none"
        >
          <option value="all">All Platforms</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
        </select>
        <span className="text-sm text-foam-300">
          {filtered.length} post{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Post List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-50">
            <FileText size={28} className="text-ocean-400" />
          </div>
          <p className="mb-1 font-display font-semibold text-deep-600">
            No posts found
          </p>
          <p className="mb-4 text-sm text-foam-300">
            {posts.length === 0
              ? 'Create your first social media post'
              : 'Try adjusting your filters'}
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 rounded-xl bg-ocean-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ocean-600"
          >
            <PlusCircle size={18} />
            Create Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
            >
              <Link
                href={`/dashboard/posts/${post.id}`}
                className="flex flex-1 items-center gap-4"
              >
                {post.media.length > 0 && post.media[0].type === 'image' ? (
                  <img
                    src={post.media[0].url}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-ocean-50">
                    <FileText size={24} className="text-ocean-400" />
                  </div>
                )}
                <div>
                  <p className="font-display font-semibold text-deep-600">
                    {post.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {post.platforms.map((p: Platform) => (
                      <span
                        key={p}
                        className="rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: PLATFORM_CONFIG[p].bgColor,
                          color: PLATFORM_CONFIG[p].color,
                        }}
                      >
                        {PLATFORM_CONFIG[p].name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-foam-300">
                    {format(new Date(post.updatedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    post.status === 'posted'
                      ? 'bg-coral-400/10 text-coral-600'
                      : post.status === 'ready'
                      ? 'bg-ocean-100 text-ocean-700'
                      : 'bg-sand-100 text-sand-500'
                  )}
                >
                  {post.status}
                </span>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="rounded-lg p-2 text-foam-300 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
