'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken, getApiPath, getAuthHeaders, removeAdminToken } from '@/lib/adminAuth';
import AdminHeader from '../components/AdminHeader';

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  read: boolean;
  created_at: string;
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    async function loadLeads() {
      try {
        const response = await fetch(getApiPath('/leads'), {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });

        if (!response.ok) {
          if (response.status === 401) {
            removeAdminToken();
            router.replace('/admin/login');
            return;
          }
          throw new Error('Erro ao carregar leads.');
        }

        setLeads(await response.json());
      } catch (error) {
        setError('Não foi possível carregar os leads.');
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [router]);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(getApiPath(`/leads/${id}/read`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Falha ao marcar como lido.');
      const updated = await response.json();
      setLeads((current) => current.map((lead) => (lead.id === updated.id ? updated : lead)));
    } catch (error) {
      setError('Não foi possível atualizar o lead.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white">Leads</h1>
            <p className="text-slate-400">Gerencie os leads recebidos pelo site.</p>
          </div>
          <div className="text-sm text-slate-500">Total: {leads.length}</div>
        </div>

        {loading && <p className="text-slate-300">Carregando...</p>}
        {error && <p className="text-rose-400 mb-4">{error}</p>}

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
            <thead className="bg-slate-950/95 text-slate-400 uppercase tracking-[0.15em] text-xs">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Origem</th>
                <th className="px-4 py-3">Lido</th>
                <th className="px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/70 transition-colors">
                  <td className="px-4 py-4">{lead.name}</td>
                  <td className="px-4 py-4">{lead.email}</td>
                  <td className="px-4 py-4">{lead.phone}</td>
                  <td className="px-4 py-4">{lead.source}</td>
                  <td className="px-4 py-4">{lead.read ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-4">
                    {!lead.read ? (
                      <button
                        className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-950 hover:bg-emerald-400 transition"
                        onClick={() => markAsRead(lead.id)}
                      >
                        Marcar como lido
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs uppercase">Concluído</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
