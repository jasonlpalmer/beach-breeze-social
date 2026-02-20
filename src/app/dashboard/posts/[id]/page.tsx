'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost, savePost, deletePost } from '@/lib/storage';
import { Post, PostStatus } from '@/types/post';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import PostCreator from '@/components/post/PostCreator';
import Link from 'next/link';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const found = getPost(id);
    setPost(found);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ocean-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-lg font-semibold text-deep-600">
          Post not found
        </p>
        <Link
          href="/dashboard/posts"
          className="text-sm text-ocean-500 hover:text-ocean-600"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: PostStatus) => {
    const updated = { ...post, status, updatedAt: new Date().toISOString() };
    savePost(updated);
    setPost(updated);
    toast.success(`Post marked as ${status}`);
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    deletePost(post.id);
    toast.success('Post deleted');
    router.push('/dashboard/posts');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/posts"
          className="flex items-center gap-2 text-sm font-medium text-ocean-500 hover:text-ocean-600"
        >
          <ArrowLeft size={16} />
          Back to Posts
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={post.status}
            onChange={(e) =>
              handleStatusChange(e.target.value as PostStatus)
            }
            className="rounded-lg border border-foam-200 bg-white px-3 py-1.5 text-sm font-medium text-deep-600 focus:border-ocean-400 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="posted">Posted</option>
          </select>
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-foam-300 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <PostCreator existingPost={post} />
    </div>
  );
}
