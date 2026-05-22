import Link from 'next/link';
import Logo from '../components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Água Pay',
  description:
    'Artigos sobre outorga de água, recursos hídricos e como economizar na cobrança pelo uso da água.',
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  emoji: string;
  category: string;
  hero_image_url?: string;
}

/* ------------------------------------------------------------------ */
/*  Static posts – swapped for API calls once backend is running      */
/* ------------------------------------------------------------------ */
const POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'o-que-e-outorga-de-agua',
    title: 'O que é Outorga de Água e por que ela importa?',
    summary:
      'Entenda como funciona o direito de uso de recursos hídricos no Brasil e quais usuários são obrigados a obter outorga.',
    content: '',
    date: '2026-04-28',
    emoji: '💧',
    category: 'Educação',
    hero_image_url:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    slug: 'como-obter-desconto-na-cobranca',
    title: 'Como obter até 50% de desconto na cobrança pelo uso da água',
    summary:
      'Descubra os mecanismos legais que permitem reduzir drasticamente os valores cobrados pelo uso de recursos hídricos.',
    content: '',
    date: '2026-05-05',
    emoji: '💰',
    category: 'Dicas',
  },
  {
    id: 3,
    slug: 'usuarios-outorgados-quem-sao',
    title: 'Usuários Outorgados: quem são e quais direitos possuem',
    summary:
      'Pessoas físicas e empresas especificadas em lei podem ser usuárias outorgadas. Saiba se você se enquadra nessa categoria.',
    content: '',
    date: '2026-05-12',
    emoji: '📋',
    category: 'Legislação',
    hero_image_url:
      'https://images.unsplash.com/photo-1516685018646-5492f5a9b5df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    slug: 'lei-9433-politica-nacional-recursos-hidricos',
    title: 'Lei 9.433/97: entenda a Política Nacional de Recursos Hídricos',
    summary:
      'A lei que criou o Sistema Nacional de Gerenciamento de Recursos Hídricos e definiu a cobrança pelo uso da água.',
    content: '',
    date: '2026-05-19',
    emoji: '⚖️',
    category: 'Legislação',
    hero_image_url:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    slug: 'monitoramento-qualidade-agua',
    title: 'Monitoramento da qualidade da água: obrigações e custos',
    summary:
      'Saiba quais são as obrigações de monitoramento para usuários outorgados e como reduzir esses custos operacionais.',
    content: '',
    date: '2026-05-21',
    emoji: '🔬',
    category: 'Operacional',
    hero_image_url:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    slug: 'agua-pay-como-funciona',
    title: 'Água Pay: como a plataforma te ajuda a economizar na conta de água',
    summary:
      'Um guia completo de como usar a plataforma Água Pay para obter descontos reais na sua cobrança pelo uso de recursos hídricos.',
    content: '',
    date: '2026-05-21',
    emoji: '🚀',
    category: 'Plataforma',
    hero_image_url:
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1200&q=80',
  },
];

const CATEGORIES = ['Todos', ...Array.from(new Set(POSTS.map((p) => p.category)))];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function BlogPage() {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
      {/* NAV */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(14,165,233,0.15)',
        }}
      >
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sky-300 hover:text-white text-sm font-semibold transition-colors"
          >
            ← Início
          </Link>
          <Link
            href="/plataformaplataforma"
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
              border: '1px solid rgba(14,165,233,0.6)',
              boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
              color: 'white',
            }}
          >
            Acessar Plataforma
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="flex flex-col items-center gap-4 px-6 py-16 text-center screen-enter">
        <span className="text-5xl">📰</span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #38bdf8, #7dd3fc, #e0f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Blog &amp; Notícias
        </h1>
        <p className="text-sky-300/60 text-base max-w-xl leading-relaxed">
          Artigos sobre recursos hídricos, outorgas, legislação e dicas para
          economizar na cobrança pelo uso da água.
        </p>
      </header>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 px-6 pb-10">
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(14,165,233,0.12)',
              border: '1px solid rgba(14,165,233,0.25)',
              color: '#7dd3fc',
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* POSTS GRID */}
      <main className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card rounded-2xl overflow-hidden group border border-transparent hover:border-sky-400/50 transition-all duration-300"
            >
              {post.hero_image_url && (
                <div className="h-48 overflow-hidden bg-slate-900">
                  <img
                    src={post.hero_image_url}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-4xl">{post.emoji}</span>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      background: 'rgba(14,165,233,0.15)',
                      border: '1px solid rgba(14,165,233,0.25)',
                      color: '#7dd3fc',
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <time className="text-sky-400/40 text-xs">{post.date}</time>
                  <h2 className="text-white font-bold text-base leading-snug group-hover:text-sky-200 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sky-300/60 text-sm leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <span className="text-sky-400 text-xs font-semibold mt-auto">
                  Ler artigo completo →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* CTA BANNER */}
      <section
        className="mx-6 mb-16 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 max-w-5xl md:mx-auto"
        style={{
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col gap-3 text-center md:text-left flex-1">
          <h3 className="text-white font-black text-2xl">
            Pronto para economizar até 50%?
          </h3>
          <p className="text-sky-300/60 text-sm leading-relaxed">
            Cadastre-se gratuitamente e descubra quanto você pode economizar na
            cobrança pelo uso da água.
          </p>
        </div>
        <Link
          href="/plataforma"
          className="relative overflow-hidden group px-8 py-4 rounded-2xl font-black text-lg tracking-wide uppercase transition-all duration-300 whitespace-nowrap flex items-center gap-3"
          style={{
            background:
              'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
            border: '1px solid rgba(14,165,233,0.6)',
            boxShadow:
              '0 8px 32px rgba(14,165,233,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          <span>💧</span>
          <span>Começar Grátis</span>
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 py-10 flex flex-col items-center gap-4 mt-auto"
        style={{
          borderTop: '1px solid rgba(14,165,233,0.15)',
          background: 'rgba(10,22,40,0.6)',
        }}
      >
        <Logo size="sm" />
        <p className="text-sky-400/30 text-xs text-center">
          © 2026 Água Pay — Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
