'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const response = await fetch('/api/blog/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          source: 'landing',
        }),
      });

      if (!response.ok) {
        let msg = 'Não foi possível enviar sua mensagem.';
        try {
          const body = await response.json();
          if (Array.isArray(body?.detail)) {
            const fieldMap: Record<string, string> = { phone: 'Telefone', message: 'Mensagem', email: 'Email', name: 'Nome' };
            msg = body.detail.map((e: { loc: string[]; msg: string }) => {
              const field = fieldMap[e.loc[1]] ?? e.loc[1];
              return `${field}: ${e.msg}`;
            }).join(' | ');
          } else if (typeof body?.detail === 'string') {
            msg = body.detail;
          }
        } catch {/* ignore */}
        throw new Error(msg);
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-slate-800 bg-slate-950/90 p-8 shadow-2xl">
      <h3 className="text-3xl font-black text-white mb-4">Envie uma mensagem</h3>
      <p className="text-slate-400 mb-6">Preencha seus dados e nossa equipe entrará em contato rapidamente.</p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          minLength={8}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
        />
        <textarea
          placeholder="Mensagem (mínimo 5 caracteres)"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          minLength={5}
          rows={5}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400 resize-none"
        />

        {status === 'success' && <p className="text-emerald-400">Mensagem enviada com sucesso.</p>}
        {status === 'error' && <p className="text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
        </button>
      </form>
    </div>
  );
}
