import Link from 'next/link';
import { notFound } from 'next/navigation';
import Logo from '../../components/Logo';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { Metadata } from 'next';

/* ------------------------------------------------------------------ */
/*  Static posts store (mirrors blog/page.tsx)                        */
/* ------------------------------------------------------------------ */
const POSTS = [
  {
    slug: 'o-que-e-outorga-de-agua',
    title: 'O que é Outorga de Água e por que ela importa?',
    date: '2026-04-28',
    emoji: '💧',
    category: 'Educação',
    content: `
A **outorga de direito de uso de recursos hídricos** é uma autorização emitida pelo poder público que permite ao seu titular usar a água de rios, lagos, represas ou aquíferos subterrâneos.

## Por que a outorga existe?

A água é um bem público, conforme estabelece a **Lei nº 9.433/1997** — a Política Nacional de Recursos Hídricos. Essa lei determinou que o uso da água pode ser outorgado, ou seja, cedido temporariamente a quem precisar dela para alguma atividade econômica ou de subsistência.

## Quem precisa de outorga?

Precisam de outorga os usuários que realizem:

- **Derivação ou captação de água** de corpo hídrico para consumo final ou insumo de processo produtivo;
- **Extração de água** de aquífero subterrâneo para consumo final ou insumo de processo produtivo;
- **Lançamento em corpo de água** de esgotos e demais resíduos líquidos ou gasosos;
- **Aproveitamento dos potenciais hidrelétricos**;
- **Outros usos** que alterem o regime, a quantidade ou a qualidade da água.

## Cobrança pelo uso da água

A partir da outorga, os usuários podem ser obrigados a pagar pela água utilizada. Esse valor é calculado com base no volume captado, na finalidade do uso e nas características do corpo hídrico.

É exatamente nesse ponto que o **Água Pay** atua: identificando oportunidades legais de desconto na sua cobrança pelo uso da água medida.

[Saiba como obter até 50% de desconto →](/)
    `,
    hero_image_url:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'como-obter-desconto-na-cobranca',
    title: 'Como obter até 50% de desconto na cobrança pelo uso da água',
    date: '2026-05-05',
    emoji: '💰',
    category: 'Dicas',
    content: `
Muitos usuários outorgados pagam mais do que deveriam na cobrança pelo uso da água. Isso acontece porque existem mecanismos legais de desconto que, por desconhecimento, não são utilizados.

## Mecanismos de desconto disponíveis

### 1. Enquadramento correto do uso
A lei permite diferentes alíquotas de cobrança conforme a finalidade do uso. Usuários com enquadramento incorreto podem estar pagando alíquotas mais altas do que o necessário.

### 2. Eficiência no uso
Programas de uso eficiente da água, como sistemas de reuso e redução de perdas, podem gerar descontos de até 50% na cobrança.

### 3. Investimentos em proteção das bacias
Investimentos em recuperação de matas ciliares e proteção das bacias hidrográficas onde a captação ocorre podem ser convertidos em créditos na cobrança.

### 4. Acordos de pagamento com os comitês
Os Comitês de Bacia Hidrográfica têm autonomia para negociar condições especiais de pagamento para usuários que adotem práticas sustentáveis.

## Como o Água Pay ajuda

Nossa plataforma identifica automaticamente quais mecanismos são aplicáveis ao seu caso específico e conduz o processo de forma digital, transparente e sem burocracia.

[Comece agora →](/)
    `,
    hero_image_url:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'usuarios-outorgados-quem-sao',
    title: 'Usuários Outorgados: quem são e quais direitos possuem',
    date: '2026-05-12',
    emoji: '📋',
    category: 'Legislação',
    content: `
A legislação brasileira define claramente quem são os usuários outorgados de recursos hídricos e quais são seus direitos e obrigações.

## Quem são os usuários outorgados?

São usuários outorgados todas as **pessoas físicas e jurídicas** que possuem autorização do poder público para usar recursos hídricos da União ou dos Estados.

### Pessoas físicas
Qualquer cidadão que realize captação de água acima dos limites de isenção estabelecidos pelo órgão gestor pode ser um usuário outorgado.

### Pessoas jurídicas
Empresas dos seguintes setores costumam ser usuárias outorgadas:
- Agropecuária e irrigação
- Indústria em geral
- Saneamento básico
- Geração de energia
- Mineração
- Aquicultura

## Direitos dos usuários outorgados

1. **Segurança jurídica** no uso da água pelo prazo da outorga;
2. **Participação** nas decisões dos Comitês de Bacia Hidrográfica;
3. **Renovação** da outorga ao final do prazo, desde que cumpridas as condicionantes;
4. **Revisão** dos valores de cobrança quando houver alteração nas condições de uso;
5. **Descontos e incentivos** por uso eficiente e sustentável da água.

## Como o Água Pay atua

O Água Pay identifica e aplica todos os direitos de desconto a que você tem direito, garantindo que você pague apenas o justo pela água que utiliza.

[Descubra seu desconto →](/)
    `,
    hero_image_url:
      'https://images.unsplash.com/photo-1516685018646-5492f5a9b5df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'lei-9433-politica-nacional-recursos-hidricos',
    title: 'Lei 9.433/97: entenda a Política Nacional de Recursos Hídricos',
    date: '2026-05-19',
    emoji: '⚖️',
    category: 'Legislação',
    content: `
A **Lei nº 9.433, de 8 de janeiro de 1997**, conhecida como "Lei das Águas", é o marco legal mais importante para o gerenciamento dos recursos hídricos no Brasil.

## O que a lei estabelece?

### Fundamentos
- A água é um **bem de domínio público**;
- A água é um **recurso natural limitado**, dotado de valor econômico;
- Em situações de escassez, o uso prioritário é o **consumo humano e de animais**;
- A gestão deve sempre proporcionar o uso **múltiplo das águas**.

### Instrumentos da Política Nacional
1. **Planos de Recursos Hídricos**
2. **Enquadramento** dos corpos de água em classes
3. **Outorga** de direitos de uso
4. **Cobrança** pelo uso dos recursos hídricos
5. **Sistema de Informações** sobre recursos hídricos

## A cobrança pelo uso da água

A cobrança tem como objetivos:
- Reconhecer a água como bem econômico e dar ao usuário uma indicação de seu real valor;
- Incentivar a racionalização do uso da água;
- Obter recursos financeiros para o financiamento dos programas e intervenções previstos nos planos de recursos hídricos das bacias hidrográficas.

## Como o Água Pay se encaixa

O Água Pay utiliza o arcabouço legal da Lei 9.433/97 para identificar os descontos e incentivos legítimos disponíveis para cada usuário outorgado.

[Saiba mais →](/)
    `,
    hero_image_url:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'monitoramento-qualidade-agua',
    title: 'Monitoramento da qualidade da água: obrigações e custos',
    date: '2026-05-21',
    emoji: '🔬',
    category: 'Operacional',
    content: `
O monitoramento da qualidade da água é uma obrigação legal para muitos usuários outorgados, mas seus custos podem ser significativamente reduzidos com as estratégias certas.

## Quem é obrigado a monitorar?

Usuários com **lançamento de efluentes** em corpos hídricos e usuários que captam grandes volumes de água geralmente são obrigados a realizar monitoramento periódico da qualidade da água.

## Parâmetros típicos monitorados

- pH, temperatura, turbidez
- Oxigênio dissolvido (OD)
- Demanda Bioquímica de Oxigênio (DBO)
- Metais pesados (em casos específicos)
- Coliformes (para usos vinculados a consumo humano)

## Como reduzir os custos de monitoramento

### 1. Monitoramento compartilhado
Usuários de uma mesma bacia podem compartilhar pontos de monitoramento e dividir os custos das análises laboratoriais.

### 2. Automação
Sensores automatizados para parâmetros como pH e temperatura reduzem a necessidade de análises laboratoriais frequentes.

### 3. Convênios com universidades
Parcerias com instituições de pesquisa permitem monitoramento de qualidade com custos reduzidos.

## Como o Água Pay pode ajudar

Nossa plataforma analisa suas obrigações de monitoramento e identifica estratégias para reduzir esses custos, mantendo total conformidade legal.

[Fale conosco →](/#contato)
    `,
    hero_image_url:
      'https://images.unsplash.com/photo-1516685018646-5492f5a9b5df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'agua-pay-como-funciona',
    title: 'Água Pay: como a plataforma te ajuda a economizar na conta de água',
    date: '2026-05-21',
    emoji: '🚀',
    category: 'Plataforma',
    content: `
O Água Pay é a primeira plataforma inteligente de carteira hídrica do Brasil. Entenda como ela funciona e como você pode começar a economizar hoje mesmo.

## O problema que resolvemos

Milhares de usuários outorgados de recursos hídricos no Brasil pagam mais do que deveriam pela água que utilizam. Isso acontece por:

- Falta de conhecimento sobre os descontos disponíveis;
- Burocracia nos processos de solicitação;
- Ausência de suporte especializado acessível.

## Como o Água Pay funciona

### Passo 1: Cadastro gratuito
Acesse a plataforma e faça seu cadastro em menos de 5 minutos, sem custo algum.

### Passo 2: Envio dos documentos
Envie sua outorga, cobrança pelo uso da água ou documentos de monitoramento diretamente pela plataforma.

### Passo 3: Análise especializada
Nossa equipe de especialistas em recursos hídricos analisa seus documentos e identifica todos os descontos aplicáveis ao seu caso.

### Passo 4: Proposta de desconto
Você recebe uma proposta clara e transparente com o percentual de desconto conquistado — até 50% do valor atual.

### Passo 5: Implementação
Com sua aprovação, implementamos as medidas necessárias para garantir seu desconto nos próximos ciclos de cobrança.

## Comece hoje mesmo

O cadastro é **100% gratuito** e o processo é totalmente digital. Não há necessidade de deslocamentos ou papelada.

[Acessar a plataforma →](/)
    `,
    hero_image_url:
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1200&q=80',
  },
];

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Post não encontrado — Água Pay Blog' };
  return {
    title: `${post.title} — Água Pay Blog`,
    description: post.content.slice(0, 160).replace(/[#*\[\]]/g, '').trim(),
  };
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

/* ------------------------------------------------------------------ */
/*  Minimal markdown renderer (bold, headers, links, lists)           */
/* ------------------------------------------------------------------ */
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineMarkup(text: string) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sky-400 underline hover:text-sky-200">$1</a>');
}

function markdownToHtml(markdown: string) {
  const lines = markdown.trim().split('\n');
  let html = '';
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    if (line.startsWith('### ')) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h3 class="text-sky-200 font-black text-xl mt-6 mb-2">${inlineMarkup(line.slice(4))}</h3>`;
    } else if (line.startsWith('## ')) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h2 class="text-sky-100 font-black text-2xl mt-8 mb-3" style="background: linear-gradient(135deg, #38bdf8, #7dd3fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${inlineMarkup(line.slice(3))}</h2>`;
    } else if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc ml-6 space-y-2 text-sky-300/80 text-base leading-relaxed">';
        inList = true;
      }
      html += `<li>${inlineMarkup(line.slice(2))}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p class="text-sky-300/80 text-base leading-relaxed">${inlineMarkup(line)}</p>`;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== slug).slice(0, 3);

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
        <Link
          href="/blog"
          className="text-sky-300 hover:text-white text-sm font-semibold transition-colors"
        >
          ← Blog
        </Link>
      </nav>

      {/* ARTICLE */}
      <article className="max-w-3xl mx-auto px-6 py-16 w-full flex flex-col gap-8 screen-enter">
        {/* Meta */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
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
            <time className="text-sky-400/50 text-xs">{post.date}</time>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-6xl mt-1">{post.emoji}</span>
            <h1
              className="text-3xl md:text-4xl font-black tracking-wide leading-tight"
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #7dd3fc, #e0f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ background: 'rgba(14,165,233,0.2)' }}
        />

        {/* Content */}
        <div className="flex flex-col gap-3">
          {post.hero_image_url && (
            <div className="overflow-hidden rounded-3xl border border-slate-800">
              <img
                src={post.hero_image_url}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: '420px' }}
              />
            </div>
          )}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(markdownToHtml(post.content)) }}
          />
        </div>
      </article>

      {/* RELATED POSTS */}
      <section className="max-w-3xl mx-auto px-6 pb-16 w-full flex flex-col gap-6">
        <h2 className="text-xl font-black text-sky-200">Artigos relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="glass-card rounded-xl p-4 flex flex-col gap-2 group"
            >
              <span className="text-2xl">{p.emoji}</span>
              <p className="text-white text-sm font-bold leading-snug group-hover:text-sky-200 transition-colors">
                {p.title}
              </p>
              <span className="text-sky-400 text-xs">Ler →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="mx-6 mb-16 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 max-w-3xl md:mx-auto"
        style={{
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col gap-3 text-center md:text-left flex-1">
          <h3 className="text-white font-black text-xl">Pronto para economizar?</h3>
          <p className="text-sky-300/60 text-sm">
            Acesse a plataforma e descubra quanto você pode economizar.
          </p>
        </div>
        <Link
          href="/plataforma"
          className="px-8 py-4 rounded-2xl font-black text-lg uppercase transition-all duration-300 whitespace-nowrap flex items-center gap-3"
          style={{
            background:
              'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
            border: '1px solid rgba(14,165,233,0.6)',
            boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
            color: 'white',
          }}
        >
          <span>💧</span>
          <span>Começar Grátis</span>
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
