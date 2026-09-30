import React from 'react';
import { Palette, Zap, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onOpenCustomizer: () => void;
  onFilterGraphic: () => void;
  onFilterElectronics: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCustomizer,
  onFilterGraphic,
  onFilterElectronics,
}) => {
  const creativeHighlights = [
    {
      title: 'Camisetas DTF & Silk',
      tag: 'Cores Vivas',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
      action: onOpenCustomizer,
    },
    {
      title: 'Canecas Resinadas AAA',
      tag: 'Alta Resolução',
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
      action: onOpenCustomizer,
    },
    {
      title: 'Plotagens & Banners',
      tag: 'Grandes Formatos',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
      action: onFilterGraphic,
    },
    {
      title: 'Cartões Verniz UV',
      tag: 'Couché 300g',
      img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
      action: onFilterGraphic,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#002f82] via-[#001d52] to-slate-950 border-b border-slate-800/80 pt-2 pb-3.5 md:pt-2.5 md:pb-4">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-10 w-64 h-64 bg-[#ff6600]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#004bbf]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-6 items-center">
          
          {/* Main Hero Copy - Compact, Crisp & Balanced */}
          <div className="lg:col-span-7 space-y-2">
            
            {/* Tagline kicker matching the real store signboard */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white bg-[#ff6600] px-2 py-0.5 rounded shadow-xs uppercase">
              <Zap className="w-3 h-3 text-white fill-white" />
              <span>GRÁFICA · INFORMÁTICA · BRINDES EM CRATO - CE</span>
            </div>

            {/* Compact Title */}
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-snug">
              Sua estampa com máxima qualidade,{' '}
              <span className="text-[#ff944d]">
                sua tecnologia com total garantia.
              </span>
            </h1>

            {/* Compact Welcome Copy */}
            <p className="text-xs text-blue-100/80 max-w-xl leading-normal">
              Bem-vindo à <strong className="text-white">Trilha Sonora</strong> no Crato! 
              Canecas fotográficas, camisetas personalizadas, plotagens, banners, 
              adesivos e produtos de informática para retirada na Rua Dr. João Pessoa, 91 (Centro) ou entrega no Cariri.
            </p>

            {/* Soft, Non-Grotesque Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                onClick={onOpenCustomizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs transition-all shadow-xs active:scale-[0.99]"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Simulador de Estampas</span>
              </button>

              <button
                onClick={onFilterGraphic}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium transition-all"
              >
                <span>Catálogo Gráfica</span>
                <ArrowRight className="w-3 h-3 text-[#ff944d]" />
              </button>

              <button
                onClick={onFilterElectronics}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium transition-all"
              >
                <Headphones className="w-3.5 h-3.5 text-[#ff944d]" />
                <span>Informática & Som</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1.5 border-t border-white/10 text-[11px] text-blue-100/80">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#ff944d] shrink-0" />
                <span>Balcão & Pronta Entrega</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#ff944d] shrink-0" />
                <span>Entrega Rápida no Cariri</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#ff944d] shrink-0" />
                <span>PIX c/ 5% de Desconto</span>
              </div>
            </div>

          </div>

          {/* Right Column: Compact Creative Product Highlights Grid (Real Graphics, No Waste of Space) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-2">
              {creativeHighlights.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="group relative flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-[#ff6600]/50 transition-all text-left overflow-hidden shadow-xs"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-950 shrink-0">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 pr-1">
                    <span className="text-[9px] font-bold text-[#ff944d] uppercase tracking-wide block">
                      {item.tag}
                    </span>
                    <p className="text-[11px] font-semibold text-white truncate group-hover:text-blue-200 transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                      Ver opções <ArrowRight className="w-2.5 h-2.5 text-[#ff6600]" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
