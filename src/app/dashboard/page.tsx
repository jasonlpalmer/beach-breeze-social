'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPosts } from '@/lib/storage';
import { Post, Platform } from '@/types/post';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { PlusCircle, FileText, CheckCircle, Edit3 } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const readyCount = posts.filter((p) => p.status === 'ready').length;
  const postedCount = posts.filter((p) => p.status === 'posted').length;

  const recentPosts = posts.slice(0, 5);

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      icon: FileText,
      color: 'bg-ocean-500',
    },
    {
      label: 'Drafts',
      value: draftCount,
      icon: Edit3,
      color: 'bg-sand-400',
    },
    {
      label: 'Ready',
      value: readyCount,
      icon: CheckCircle,
      color: 'bg-ocean-400',
    },
    {
      label: 'Posted',
      value: postedCount,
      icon: CheckCircle,
      color: 'bg-coral-500',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-deep-600">
            Welcome Back!
          </h1>
          <p className="mt-1 text-sm text-foam-300">
            Manage your Beach Breeze Boxers social media content
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`${stat.color} flex h-10 w-10 items-center justify-center rounded-xl text-white`}
              >
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-deep-600">
                  {stat.value}
                </p>
                <p className="text-xs text-foam-300">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-deep-600">
            Recent Posts
          </h3>
          <Link
            href="/dashboard/posts"
            className="text-sm font-medium text-ocean-500 hover:text-ocean-600"
          >
            View All
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-50">
              <FileText size={28} className="text-ocean-400" />
            </div>
            <p className="mb-1 font-display font-semibold text-deep-600">
              No posts yet
            </p>
            <p className="mb-4 text-sm text-foam-300">
              Create your first social media post
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
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/dashboard/posts/${post.id}`}
                className="flex items-center justify-between rounded-xl border border-foam-200 p-4 transition-colors hover:bg-foam-50"
              >
                <div className="flex items-center gap-3">
                  {post.media.length > 0 && post.media[0].type === 'image' ? (
                    <img
                      src={post.media[0].url}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ocean-50">
                      <FileText size={20} className="text-ocean-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-deep-600">{post.title}</p>
                    <div className="mt-1 flex gap-1.5">
                      {post.platforms.map((p: Platform) => (
                        <span
                          key={p}
                          className="rounded-md px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor:
                              PLATFORM_CONFIG[p].bgColor,
                            color: PLATFORM_CONFIG[p].color,
                          }}
                        >
                          {PLATFORM_CONFIG[p].name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      post.status === 'posted'
                        ? 'bg-coral-400/10 text-coral-600'
                        : post.status === 'ready'
                        ? 'bg-ocean-100 text-ocean-700'
                        : 'bg-sand-100 text-sand-500'
                    }`}
                  >
                    {post.status}
                  </span>
                  <p className="mt-1 text-xs text-foam-300">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
