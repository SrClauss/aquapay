'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';
import { getAdminToken, getApiPath, getAuthHeaders, removeAdminToken } from '@/lib/adminAuth';

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroUrl, setHeroUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    async function loadPost() {
      try {
        const response = await fetch(getApiPath(`/posts/${slug}`), {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        if (!response.ok) {
          if (response.status === 401) {
            removeAdminToken();
            router.replace('/admin/login');
            return;
          }
          throw new Error('Falha ao carregar post.');
        }
        const data = await response.json();
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setHeroUrl(data.hero_image_url ?? '');
      } catch (error) {
        setError('Não foi possível carregar o post.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [router, slug]);

  const uploadHero = async (file: File) => {
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
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
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (heroImage) {
        await uploadHero(heroImage);
      }
      const response = await fetch(getApiPath(`/posts/${slug}`), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          summary,
          content,
          hero_image_url: heroUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar post.');
      }

      setSuccess('Post atualizado com sucesso.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Deseja realmente excluir este post?')) return;
    setLoading(true);
    try {
      const response = await fetch(getApiPath(`/posts/${slug}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Falha ao excluir post.');
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black">Editar post</h1>
            <p className="text-slate-400">Atualize o conteúdo do post.</p>
          </div>
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-rose-400 disabled:opacity-60"
            disabled={loading}
          >
            Excluir
          </button>
        </div>

        {loading && <p className="text-slate-300">Carregando...</p>}
        {error && <p className="text-rose-400 mb-4">{error}</p>}
        {success && <p className="text-emerald-400 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
          <label className="block">
            <span className="text-slate-300 text-sm">Título</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
            {heroUrl && <p className="mt-2 text-slate-400 text-sm">Imagem atual: {heroUrl}</p>}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? 'Atualizando...' : 'Salvar alterações'}
          </button>
        </form>
      </main>
    </div>
  );
}
