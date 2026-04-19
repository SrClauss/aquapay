'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Logo from './components/Logo';
import ServiceCard from './components/ServiceCard';
import WaterBubbles from './components/WaterBubbles';

type Screen = 'initial' | 'services' | 'upload' | 'confirmation';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('initial');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [email, setEmail] = useState('');
  const [showDevMsg, setShowDevMsg] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useCallback((target: Screen) => {
    setScreen(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 700);
  };

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {/* SW registration failed silently */});
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
      <WaterBubbles />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col" style={{ zIndex: 2 }}>
        {/* ======== SCREEN 1: INITIAL ======== */}
        {screen === 'initial' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-10 screen-enter">
            {/* Logo */}
            <div className="flex flex-col items-center gap-6">
              <Logo size="lg" />
              <p className="text-sky-300/60 text-center text-sm max-w-xs leading-relaxed">
                Plataforma inteligente <span className="text-white font-bold">de</span> gestão de recursos hídricos
              </p>
            </div>

            {/* Tagline card */}
            <div className="glass rounded-2xl px-8 py-4 text-center max-w-sm">
              <p className="text-sky-200 text-xs tracking-widest uppercase font-semibold">
                &quot;Sua Carteira Hídrica de Recebimentos e Pagamentos&quot;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {/* Quero RECEBER */}
              <button
                onClick={() => navigate('services')}
                className="relative overflow-hidden group w-full py-5 px-6 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 animate-fade-in-up"
                style={{
                  background: 'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(6,182,212,0.85))',
                  border: '1px solid rgba(14,165,233,0.6)',
                  boxShadow: '0 8px 32px rgba(14,165,233,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>💰</span>
                  <span>Quero RECEBER</span>
                </span>
                {/* Shimmer */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </button>

              {/* Quero COMPRAR */}
              <button
                onClick={() => {
                  setShowDevMsg(true);
                  setTimeout(() => setShowDevMsg(false), 3500);
                }}
                className="relative overflow-hidden group w-full py-5 px-6 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 animate-fade-in-up delay-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-sky-100">
                  <span>🛒</span>
                  <span>Quero PAGAR</span>
                </span>
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </button>
            </div>

            {/* Dev message toast */}
            {showDevMsg && (
              <div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass rounded-2xl px-6 py-4 animate-fade-in"
                style={{
                  border: '1px solid rgba(251,191,36,0.4)',
                  background: 'rgba(120,53,15,0.8)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <p className="text-amber-300 font-bold text-sm flex items-center gap-2">
                  <span>🚧</span>
                  <span>Funcionalidade em desenvolvimento</span>
                </p>
              </div>
            )}

            {/* Footer */}
            <p className="text-sky-400/30 text-xs text-center mt-4">
              © 2026 Água Pay — Todos os direitos reservados
            </p>
          </div>
        )}

        {/* ======== SCREEN 2: SERVICES ======== */}
        {screen === 'services' && (
          <div className="flex-1 flex flex-col px-4 py-8 gap-6 screen-enter">
            {/* Header */}
            <div className="flex items-center gap-4 px-2">
              <button
                onClick={() => navigate('initial')}
                className="glass rounded-xl p-2.5 text-sky-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Logo size="sm" />
            </div>

            {/* Title */}
            <div className="text-center px-4">
              <h2 className="text-2xl font-black text-white text-glow-white mb-2">
                Selecione o Serviço
              </h2>
              <p className="text-sky-300/60 text-sm">
                Escolha o tipo de documento para obter seu desconto
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto w-full">
              <ServiceCard
                icon="📋"
                title="Descontos nas OUTORGAS de Água Medida"
                description="Reduza os custos da sua outorga de direito de uso de recursos hídricos. Nossa análise especializada encontra o desconto ideal para você."
                buttonText="Clique aqui e ENVIE sua OUTORGA..."
                onClick={() => { setSelectedService(1); navigate('upload'); }}
                delay={100}
              />
              <ServiceCard
                icon="📊"
                title="Descontos nos MONITORAMENTOS das Águas"
                description="Economize nos custos de monitoramento da qualidade e quantidade das suas águas com nossa consultoria especializada."
                buttonText="Clique aqui e ENVIE uma FOTO..."
                onClick={() => { setSelectedService(2); navigate('upload'); }}
                delay={200}
              />
              <ServiceCard
                icon="📄"
                title="Descontos nas COBRANÇAS pelo Uso..."
                description="Reduza as cobranças pelo uso de recursos hídricos. Analisamos sua situação e encontramos o melhor caminho para economia."
                buttonText='Clique aqui e ENVIE seu "BOLETO"...'
                onClick={() => { setSelectedService(3); navigate('upload'); }}
                delay={300}
              />
            </div>
          </div>
        )}

        {/* ======== SCREEN 3: UPLOAD + EMAIL ======== */}
        {screen === 'upload' && (
          <div className="flex-1 flex flex-col px-4 py-8 gap-6 screen-enter">
            {/* Header */}
            <div className="flex items-center gap-4 px-2">
              <button
                onClick={() => navigate('services')}
                className="glass rounded-xl p-2.5 text-sky-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Logo size="sm" />
            </div>

            {/* Upload Section */}
            <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-xl font-black text-white text-glow-white mb-1">
                  Envie seu Documento
                </h2>
                <p className="text-sky-300/60 text-sm">
                  {selectedService === 1 && 'Envie sua outorga para análise'}
                  {selectedService === 2 && 'Envie uma foto do monitoramento'}
                  {selectedService === 3 && 'Envie seu boleto para análise'}
                </p>
              </div>

              {/* Upload Area */}
              <div
                className={`upload-area rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {fileName ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                      style={{
                        background: 'rgba(14,165,233,0.15)',
                        border: '1px solid rgba(14,165,233,0.4)',
                      }}>
                      ✅
                    </div>
                    <div className="text-center">
                      <p className="text-sky-200 font-bold text-sm mb-1">Arquivo selecionado!</p>
                      <p className="text-sky-400/70 text-xs max-w-[200px] truncate">{fileName}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFileName(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="text-sky-400/60 text-xs hover:text-sky-300 transition-colors"
                    >
                      Trocar arquivo
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-water-drop"
                      style={{
                        background: 'rgba(14,165,233,0.1)',
                        border: '1px solid rgba(14,165,233,0.25)',
                      }}>
                      📂
                    </div>
                    <div className="text-center">
                      <p className="text-sky-200 font-semibold text-sm mb-1">
                        Arraste e solte aqui
                      </p>
                      <p className="text-sky-400/50 text-xs">ou clique para selecionar</p>
                    </div>
                    <p className="text-sky-400/40 text-xs">PDF, imagens ou documentos</p>
                  </>
                )}
              </div>

              {/* Continue button */}
              <button
                onClick={() => fileName && navigate('confirmation')}
                disabled={!fileName}
                className={`btn-water w-full py-3 rounded-xl font-bold tracking-wide text-sm transition-all duration-300 ${fileName ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
              >
                {fileName ? 'Continuar' : 'Continuar (selecione um arquivo)'}
              </button>
            </div>

            {/* EMAIL SECTION */}
            <div className="max-w-lg mx-auto w-full">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Red header stripe */}
                <div
                  className="px-6 py-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(220,38,38,0.7), rgba(185,28,28,0.7))',
                    borderBottom: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <h3 className="text-white font-black text-base tracking-wide flex items-center gap-2">
                    <span>📧</span>
                    <span>Adicionar todas as suas contas de e-mail</span>
                  </h3>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                  {/* Provider icons */}
                  <div className="flex items-center justify-around">
                    {[
                      { icon: '🟦', label: 'Microsoft 365' },
                      { icon: '🔴', label: 'Gmail' },
                      { icon: '💜', label: 'Yahoo!' },
                      { icon: '⬜', label: 'iCloud' },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          {icon}
                        </div>
                        <span className="text-sky-300/60 text-[10px] text-center leading-tight max-w-[56px]">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Info text */}
                  <p className="text-sky-300/60 text-xs leading-relaxed text-center">
                    O Outlook suporta o Microsoft 365, Gmail, Yahoo, iCloud e IMAP.{' '}
                    <span className="text-sky-400 underline cursor-pointer">Saiba mais</span>{' '}
                    <span className="text-sky-400 underline cursor-pointer">Mais</span>
                  </p>

                  {/* Email input */}
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Digite seu endereço de e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-sky-400/40 outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />

                    {/* Login button */}
                    <button
                      onClick={(e) => {
                        handleRipple(e);
                        setTimeout(() => navigate('confirmation'), 300);
                      }}
                      className="relative overflow-hidden w-full py-4 px-6 rounded-xl font-black text-base tracking-widest uppercase text-white transition-all duration-300 flex items-center justify-center gap-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))',
                        border: '1px solid rgba(239,68,68,0.5)',
                        boxShadow: '0 6px 24px rgba(239,68,68,0.35)',
                      }}
                    >
                      {ripple && (
                        <span
                          className="absolute animate-ripple rounded-full bg-white/30"
                          style={{
                            width: 100,
                            height: 100,
                            left: ripple.x - 50,
                            top: ripple.y - 50,
                          }}
                        />
                      )}
                      <span>📨</span>
                      <span>LOGIN COM E-MAIL</span>
                      <span className="text-red-200">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======== SCREEN 4: CONFIRMATION ======== */}
        {screen === 'confirmation' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-8 screen-enter">
            {/* Logo small */}
            <Logo size="md" />

            {/* Success card */}
            <div
              className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-6 text-center"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(14,165,233,0.3)',
                boxShadow: '0 8px 48px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Success icon with ripple */}
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl animate-water-drop"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(6,182,212,0.1))',
                    border: '2px solid rgba(14,165,233,0.4)',
                    boxShadow: '0 0 40px rgba(14,165,233,0.3)',
                  }}
                >
                  💧
                </div>
                {/* Pulse rings */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-sky-400/20"
                    style={{
                      animation: `ripple ${1 + i * 0.4}s ease-out ${i * 0.3}s infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Heading */}
              <div className="flex flex-col gap-3">
                <h2
                  className="text-2xl font-black tracking-wide text-glow"
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8, #7dd3fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  RECEBEMOS SEUS DOCUMENTOS
                </h2>

                <div
                  className="px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(14,165,233,0.08)',
                    border: '1px solid rgba(14,165,233,0.2)',
                  }}
                >
                  <p className="text-sky-200 text-sm font-semibold leading-relaxed">
                    &ldquo;ESTAMOS ANALISANDO QUANTO DE DESCONTO VOCÊ GANHOU&rdquo;
                  </p>
                </div>
              </div>

              {/* Alert banner */}
              <div
                className="w-full px-6 py-4 rounded-2xl animate-glow"
                style={{
                  background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,182,212,0.1))',
                  border: '2px solid rgba(14,165,233,0.5)',
                }}
              >
                <p className="text-sky-200 font-black text-xl tracking-[0.4em]">
                  AGUARDE!!!
                </p>
                <p className="text-sky-400/60 text-xs mt-1">
                  Você receberá um retorno em breve
                </p>
              </div>

              {/* Lead creation indicator */}
              <div className="flex items-center gap-2 text-sky-400/60 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Lead criado com sucesso</span>
              </div>
            </div>

            {/* Back to start */}
            <button
              onClick={() => {
                setScreen('initial');
                setFileName(null);
                setEmail('');
                setSelectedService(null);
              }}
              className="glass rounded-xl px-6 py-3 text-sky-400/70 text-sm hover:text-sky-200 transition-all duration-300 hover:border-sky-400/40 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Voltar ao início</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
