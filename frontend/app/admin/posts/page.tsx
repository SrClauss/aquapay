'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminToken, getApiPath, getAuthHeaders, removeAdminToken } from '@/lib/adminAuth';
import AdminHeader from '../components/AdminHeader';

type PostItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  hero_image_url?: string | null;
  updated_at?: string | null;
};

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    async function loadPosts() {
      try {
        const response = await fetch(getApiPath('/posts?page=1&per_page=50'), {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        if (!response.ok) {
          if (response.status === 401) {
            removeAdminToken();
            router.replace('/admin/login');
            return;
          }
          throw new Error('Falha ao buscar posts.');
        }
        const data = await response.json();
        setPosts(data.posts ?? []);
      } catch (error) {
        setError('Não foi possível carregar os posts.');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black">Posts</h1>
            <p className="text-slate-400">Gerencie os posts do blog e atualize conteúdos.</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400"
          >
            Novo post
          </Link>
        </div>

        {loading && <p className="text-slate-300">Carregando posts...</p>}
        {error && <p className="text-rose-400 mb-4">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl">{post.title.charAt(0)}</div>
                <div>
                  <h2 className="text-lg font-bold text-white truncate">{post.title}</h2>
                  <p className="text-slate-500 text-xs">{post.slug}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{post.summary}</p>
              {post.hero_image_url && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800">
                  <img src={post.hero_image_url} alt={post.title} className="h-40 w-full object-cover" />
                </div>
              )}
              <Link
                href={`/admin/posts/${post.slug}`}
                className="inline-flex items-center rounded-2xl bg-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
