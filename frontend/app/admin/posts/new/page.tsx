'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';
import { getAdminToken, getApiPath, getAuthHeaders } from '@/lib/adminAuth';

export default function NewPostPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroUrl, setHeroUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === toSlug(title)) {
      setSlug(toSlug(value));
    }
  };

  const handleUploadHero = async (file: File): Promise<string> => {
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return '';
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(getApiPath('/upload/image'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar imagem.');
    }

    const body = await response.json();
    setHeroUrl(body.url);
    return body.url as string;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalHeroUrl = heroUrl;
      if (heroImage && !heroUrl) {
        finalHeroUrl = await handleUploadHero(heroImage);
      }
      const response = await fetch(getApiPath('/posts'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          title,
          summary,
          content,
          hero_image_url: finalHeroUrl || null,
          emoji: '💧',
          category: 'Geral',
          author: 'Equipe Água Pay',
        }),
      });
      if (!response.ok) {
        let msg = 'Falha ao criar post.';
        try {
          const body = await response.json();
          if (Array.isArray(body?.detail)) {
            msg = body.detail.map((e: { loc: string[]; msg: string }) =>
              `${e.loc.slice(1).join('.')}: ${e.msg}`
            ).join(' | ');
          } else if (typeof body?.detail === 'string') {
            msg = body.detail;
          }
        } catch {/* ignore */}
        throw new Error(msg);
      }
      router.push('/admin/posts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black">Novo post</h1>
          <p className="text-slate-400">Crie um post novo para o blog.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
          <label className="block">
            <span className="text-slate-300 text-sm">Slug</span>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="exemplo-post-de-agua"
            />
          </label>

          <label className="block">
            <span className="text-slate-300 text-sm">Título</span>
            <input
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
          </label>

          <label className="block">
            <span className="text-slate-300 text-sm">Resumo</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              required
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 resize-none"
            />
          </label>

          <label className="block">
            <span className="text-slate-300 text-sm">Conteúdo</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={8}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 resize-none"
            />
          </label>

          <label className="block">
            <span className="text-slate-300 text-sm">Imagem Hero</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setHeroImage(file);
              }}
              className="mt-2 w-full text-slate-300"
            />
            {heroUrl && <p className="mt-2 text-slate-400 text-sm">URL enviada: {heroUrl}</p>}
          </label>

          {error && <p className="text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Criar post'}
          </button>
        </form>
      </main>
    </div>
  );
}
