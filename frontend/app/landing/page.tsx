import Link from 'next/link';
import Logo from '../components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Água Pay — Carteira Hídrica Inteligente',
  description:
    'Plataforma inteligente de carteira hídrica de recebimentos e pagamentos. Até 50% de desconto na Cobrança pelo Uso da Água Medida.',
};

/* ------------------------------------------------------------------ */
/*  Static blog preview data (replaced by API in production)          */
/* ------------------------------------------------------------------ */
const BLOG_PREVIEW = [
  {
    id: 1,
    slug: 'o-que-e-outorga-de-agua',
    title: 'O que é Outorga de Água e por que ela importa?',
    summary:
      'Entenda como funciona o direito de uso de recursos hídricos no Brasil e quais usuários são obrigados a obter outorga.',
    date: '2026-04-28',
    emoji: '💧',
  },
  {
    id: 2,
    slug: 'como-obter-desconto-na-cobranca',
    title: 'Como obter até 50% de desconto na cobrança pelo uso da água',
    summary:
      'Descubra os mecanismos legais que permitem reduzir drasticamente os valores cobrados pelo uso de recursos hídricos.',
    date: '2026-05-05',
    emoji: '💰',
  },
  {
    id: 3,
    slug: 'usuarios-outorgados-quem-sao',
    title: 'Usuários Outorgados: quem são e quais direitos possuem',
    summary:
      'Pessoas físicas e empresas especificadas em lei podem ser usuárias outorgadas. Saiba se você se enquadra nessa categoria.',
    date: '2026-05-12',
    emoji: '📋',
  },
];

/* ------------------------------------------------------------------ */
/*  Small reusable components                                          */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl md:text-4xl font-black tracking-wide text-center"
      style={{
        background: 'linear-gradient(135deg, #38bdf8, #7dd3fc, #e0f2fe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </h2>
  );
}

function InfoCard({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
      <span className="text-4xl">{emoji}</span>
      <h3 className="text-white font-black text-lg leading-snug">{title}</h3>
      <p className="text-sky-300/70 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function BlogCard({
  post,
}: {
  post: (typeof BLOG_PREVIEW)[number];
}) {
  return (
    <Link
      href={`/landing/blog/${post.slug}`}
      className="glass-card rounded-2xl p-6 flex flex-col gap-3 hover:border-sky-400/50 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{post.emoji}</span>
        <time className="text-sky-400/50 text-xs">{post.date}</time>
      </div>
      <h3 className="text-white font-bold text-base leading-snug group-hover:text-sky-200 transition-colors">
        {post.title}
      </h3>
      <p className="text-sky-300/60 text-sm leading-relaxed">{post.summary}</p>
      <span className="text-sky-400 text-xs font-semibold mt-auto">
        Ler mais →
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
      {/* =========================================================== */}
      {/* NAV                                                         */}
      {/* =========================================================== */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(14,165,233,0.15)',
        }}
      >
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <Link
            href="/landing/blog"
            className="text-sky-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/"
            className="btn-water px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
              border: '1px solid rgba(14,165,233,0.6)',
              boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
            }}
          >
            Acessar Plataforma
          </Link>
        </div>
      </nav>

      {/* =========================================================== */}
      {/* HERO                                                        */}
      {/* =========================================================== */}
      <section className="flex flex-col items-center justify-center px-6 py-24 gap-10 text-center screen-enter">
        <Logo size="lg" />

        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight text-glow-white">
            Economize até{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              50%
            </span>{' '}
            na Cobrança pelo Uso da Água
          </h1>
          <p className="text-sky-300/70 text-lg leading-relaxed">
            Plataforma inteligente de{' '}
            <strong className="text-sky-200">carteira hídrica</strong> de
            Recebimentos &amp; Pagamentos para Usuários Outorgados de Recursos
            Hídricos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="relative overflow-hidden group px-10 py-5 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
              border: '1px solid rgba(14,165,233,0.6)',
              boxShadow:
                '0 8px 32px rgba(14,165,233,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>💧</span>
              <span>Quero meu Desconto</span>
            </span>
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </Link>

          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden group px-10 py-5 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
            }}
          >
            <span className="flex items-center gap-3">
              <span>💬</span>
              <span>Fale Conosco</span>
            </span>
          </a>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {[
            { label: 'Desconto Real', value: 'Até 50%' },
            { label: 'Estados Atendidos', value: '26 + DF' },
            { label: 'Cadastro', value: '100% Grátis' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="glass rounded-2xl px-6 py-3 flex flex-col items-center gap-1"
            >
              <span
                className="text-2xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #7dd3fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </span>
              <span className="text-sky-400/60 text-xs uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================== */}
      {/* O QUE É O ÁGUA PAY?                                        */}
      {/* =========================================================== */}
      <section className="px-6 py-20 flex flex-col items-center gap-10 max-w-5xl mx-auto w-full">
        <SectionTitle>O que é o Água Pay?</SectionTitle>
        <div
          className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center w-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(14,165,233,0.2)',
            boxShadow: '0 8px 48px rgba(14,165,233,0.1)',
          }}
        >
          <div className="text-7xl">💧</div>
          <div className="flex flex-col gap-4 text-center md:text-left">
            <p className="text-sky-100 text-lg leading-relaxed">
              Somos uma{' '}
              <strong className="text-white">
                plataforma inteligente de carteira hídrica
              </strong>{' '}
              de <strong className="text-orange-400">RECEBIMENTOS</strong> &amp;{' '}
              <strong className="text-orange-400">PAGAMENTOS</strong>, que
              proporciona{' '}
              <strong className="text-sky-300">DESCONTOS de VERDADE</strong> na
              Cobrança pelo Uso da Água Medida de pessoas físicas em geral e
              empresas especificadas em lei.
            </p>
            <Link
              href="/"
              className="self-center md:self-start btn-water px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest"
              style={{
                background:
                  'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
                border: '1px solid rgba(14,165,233,0.6)',
                boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
              }}
            >
              Começar agora →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* QUEM PODE USAR?                                            */}
      {/* =========================================================== */}
      <section className="px-6 py-20 flex flex-col items-center gap-10 max-w-5xl mx-auto w-full">
        <SectionTitle>Quem pode usar o Água Pay?</SectionTitle>
        <p className="text-sky-300/70 text-center text-base max-w-2xl leading-relaxed">
          Todas as <strong className="text-sky-200">pessoas físicas</strong> em
          geral e certas{' '}
          <strong className="text-sky-200">empresas</strong> que são{' '}
          <strong className="text-orange-400">USUÁRIAS OUTORGADAS</strong> de
          Recursos Hídricos da União e dos 26 Estados + Distrito Federal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <InfoCard
            emoji="🌾"
            title="Produtores Rurais"
            body="Irrigantes, criadores e produtores com captação de água superficial ou subterrânea outorgada."
          />
          <InfoCard
            emoji="🏭"
            title="Indústrias"
            body="Empresas industriais que utilizam recursos hídricos como insumo ou para resfriamento de processos."
          />
          <InfoCard
            emoji="🏗️"
            title="Saneamento & Infraestrutura"
            body="Concessionárias, empresas de saneamento e prestadores de serviço público com outorga federal ou estadual."
          />
          <InfoCard
            emoji="⛏️"
            title="Mineração"
            body="Mineradoras com uso expressivo de água em lavra, beneficiamento ou controle de poeira."
          />
          <InfoCard
            emoji="🐟"
            title="Aquicultura"
            body="Piscicultores e aquicultores com captação de água para criação de organismos aquáticos."
          />
          <InfoCard
            emoji="👤"
            title="Pessoas Físicas"
            body="Qualquer pessoa física que possua outorga de uso de recursos hídricos e pague pela sua utilização."
          />
        </div>
      </section>

      {/* =========================================================== */}
      {/* OBJETIVO                                                    */}
      {/* =========================================================== */}
      <section className="px-6 py-20 flex flex-col items-center gap-10 w-full"
        style={{
          background: 'rgba(14,165,233,0.05)',
          borderTop: '1px solid rgba(14,165,233,0.1)',
          borderBottom: '1px solid rgba(14,165,233,0.1)',
        }}
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-10">
          <SectionTitle>Qual o objetivo do Água Pay?</SectionTitle>
          <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
            <div
              className="text-8xl md:text-9xl font-black"
              style={{
                background: 'linear-gradient(135deg, #f97316, #fb923c, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 30px rgba(249,115,22,0.4))',
              }}
            >
              50%
            </div>
            <p className="text-sky-100 text-xl leading-relaxed">
              Ofertar até{' '}
              <strong className="text-orange-400">50% de DESCONTO DE VERDADE</strong>{' '}
              para Usuários Outorgados de Recursos Hídricos em relação à
              Cobrança pelo Uso da Água Medida.
            </p>
            <p className="text-sky-300/60 text-base leading-relaxed">
              Nossa plataforma analisa sua outorga, identifica oportunidades de
              redução e conduz o processo de forma 100% digital e segura.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* COMO FUNCIONA                                               */}
      {/* =========================================================== */}
      <section className="px-6 py-20 flex flex-col items-center gap-10 max-w-5xl mx-auto w-full">
        <SectionTitle>Como funciona?</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[
            {
              step: '01',
              emoji: '📋',
              title: 'Envie sua Outorga',
              body: 'Faça upload do documento de outorga ou da cobrança pelo uso da água.',
            },
            {
              step: '02',
              emoji: '🔍',
              title: 'Análise Especializada',
              body: 'Nossa equipe especializada analisa os dados e identifica o desconto aplicável.',
            },
            {
              step: '03',
              emoji: '💡',
              title: 'Proposta de Desconto',
              body: 'Você recebe uma proposta clara com o percentual de desconto conquistado.',
            },
            {
              step: '04',
              emoji: '✅',
              title: 'Economia Real',
              body: 'Aprove e passe a pagar menos na cobrança pelo uso dos seus recursos hídricos.',
            },
          ].map(({ step, emoji, title, body }) => (
            <div
              key={step}
              className="glass-card rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden"
            >
              <span
                className="absolute -top-3 -right-2 text-7xl font-black opacity-10 select-none"
                style={{ color: '#0ea5e9' }}
              >
                {step}
              </span>
              <span className="text-3xl">{emoji}</span>
              <h3 className="text-white font-black text-base">{title}</h3>
              <p className="text-sky-300/60 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================== */}
      {/* BLOG PREVIEW                                                */}
      {/* =========================================================== */}
      <section className="px-6 py-20 flex flex-col items-center gap-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-center gap-3">
          <SectionTitle>Blog &amp; Notícias</SectionTitle>
          <p className="text-sky-300/60 text-sm">
            Fique por dentro das novidades sobre recursos hídricos e outorgas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {BLOG_PREVIEW.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <Link
          href="/landing/blog"
          className="glass rounded-2xl px-10 py-4 font-bold text-sky-300 hover:text-white hover:border-sky-400/50 transition-all duration-300 text-sm uppercase tracking-widest"
          style={{ border: '1px solid rgba(14,165,233,0.25)' }}
        >
          Ver todos os artigos →
        </Link>
      </section>

      {/* =========================================================== */}
      {/* CONTATO / CTA                                              */}
      {/* =========================================================== */}
      <section
        id="contato"
        className="px-6 py-24 flex flex-col items-center gap-10 w-full"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(14,165,233,0.08) 50%, transparent 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8 text-center">
          <SectionTitle>Ficou interessado? Fale conosco!</SectionTitle>
          <p className="text-sky-300/70 text-lg leading-relaxed">
            Estamos te esperando.{' '}
            <strong className="text-sky-200">Prazer em te servir.</strong>{' '}
            Entre em contato agora mesmo — é{' '}
            <strong className="text-orange-400">100% GRATUITO</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden group px-10 py-5 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 flex items-center gap-3"
              style={{
                background:
                  'linear-gradient(135deg, rgba(34,197,94,0.85), rgba(22,163,74,0.85))',
                border: '1px solid rgba(34,197,94,0.6)',
                boxShadow:
                  '0 8px 32px rgba(34,197,94,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
              }}
            >
              <span>💬</span>
              <span>WhatsApp Gratuito</span>
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </a>

            <Link
              href="/"
              className="relative overflow-hidden group px-10 py-5 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 flex items-center gap-3"
              style={{
                background:
                  'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
                border: '1px solid rgba(14,165,233,0.6)',
                boxShadow:
                  '0 8px 32px rgba(14,165,233,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
              }}
            >
              <span>💧</span>
              <span>Acessar Plataforma</span>
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* FOOTER                                                      */}
      {/* =========================================================== */}
      <footer
        className="px-6 py-10 flex flex-col items-center gap-4"
        style={{
          borderTop: '1px solid rgba(14,165,233,0.15)',
          background: 'rgba(10,22,40,0.6)',
        }}
      >
        <Logo size="sm" />
        <nav className="flex flex-wrap justify-center gap-6 text-sky-400/60 text-sm">
          <Link href="/landing" className="hover:text-sky-300 transition-colors">
            Início
          </Link>
          <Link href="/landing/blog" className="hover:text-sky-300 transition-colors">
            Blog
          </Link>
          <Link href="/" className="hover:text-sky-300 transition-colors">
            Plataforma
          </Link>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-300 transition-colors"
          >
            Contato
          </a>
        </nav>
        <p className="text-sky-400/30 text-xs text-center">
          © 2026 Água Pay — Todos os direitos reservados.
          <br />
          Plataforma regulada pela legislação de recursos hídricos (Lei 9.433/97).
        </p>
      </footer>
    </div>
  );
}
