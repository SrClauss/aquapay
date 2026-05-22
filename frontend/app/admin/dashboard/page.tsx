'use client';

import { useEffect, useState } from 'react';
import { getAuthHeaders, getApiPath, getAdminToken, removeAdminToken } from '@/lib/adminAuth';
import { useRouter } from 'next/navigation';
import AdminHeader from '../components/AdminHeader';

type Summary = {
  totalPosts: number;
  totalLeads: number;
  unreadLeads: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    async function loadSummary() {
      try {
        const [postsResponse, leadsResponse] = await Promise.all([
          fetch(getApiPath('/posts?page=1&per_page=1'), {
            headers: getAuthHeaders(),
            cache: 'no-store',
          }),
          fetch(getApiPath('/leads'), {
            headers: getAuthHeaders(),
            cache: 'no-store',
          }),
        ]);

        if (!postsResponse.ok || !leadsResponse.ok) {
          if (postsResponse.status === 401 || leadsResponse.status === 401) {
            removeAdminToken();
            router.replace('/admin/login');
            return;
          }
          throw new Error('Erro ao buscar dados do painel.');
        }

        const postsData = await postsResponse.json();
        const leadsData = await leadsResponse.json();

        setSummary({
          totalPosts: postsData.total ?? postsData.length ?? 0,
          totalLeads: Array.isArray(leadsData) ? leadsData.length : 0,
          unreadLeads: Array.isArray(leadsData) ? leadsData.filter((lead: any) => !lead.read).length : 0,
        });
      } catch (error) {
        setError('Não foi possível carregar o painel.');
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">Resumo rápido de posts e leads</p>
        </div>

        {loading && <p className="text-slate-300">Carregando dados...</p>}
        {error && <p className="text-rose-400">{error}</p>}

        {summary && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <p className="text-slate-400 uppercase text-xs tracking-[0.3em]">Posts</p>
              <p className="mt-4 text-4xl font-black text-white">{summary.totalPosts}</p>
              <p className="mt-2 text-slate-500 text-sm">Posts cadastrados</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <p className="text-slate-400 uppercase text-xs tracking-[0.3em]">Leads</p>
              <p className="mt-4 text-4xl font-black text-white">{summary.totalLeads}</p>
              <p className="mt-2 text-slate-500 text-sm">Leads recebidos</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <p className="text-slate-400 uppercase text-xs tracking-[0.3em]">Não lidos</p>
              <p className="mt-4 text-4xl font-black text-white">{summary.unreadLeads}</p>
              <p className="mt-2 text-slate-500 text-sm">Leads aguardando leitura</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
