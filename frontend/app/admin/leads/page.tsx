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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
                <th className="px-4 py-3">Mensagem</th>
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
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="rounded-2xl bg-sky-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-sky-500 transition"
                    >
                      Ver
                    </button>
                  </td>
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

      {/* Modal de mensagem */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                <p className="text-sm text-slate-400">{selectedLead.email} · {selectedLead.phone}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white transition text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="whitespace-pre-wrap text-slate-200 leading-relaxed">{selectedLead.message}</p>
            {!selectedLead.read && (
              <button
                className="mt-6 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 hover:bg-emerald-400 transition"
                onClick={() => { markAsRead(selectedLead.id); setSelectedLead(null); }}
              >
                Marcar como lido
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
