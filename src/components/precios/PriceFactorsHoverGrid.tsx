import React from 'react';

const FACTORS = [
  {
    icon: '🧬',
    title: 'Genética y Portación (Lh/L1/L4)',
    description: 'Los ejemplares portadores del gen de pelo largo difieren en valor respecto a los ejemplares visuales completos con manto afelpado denso.',
  },
  {
    icon: '🎨',
    title: 'Variedad de Color Exótico',
    description: 'Tonos raros como Visual Isabella (bb/dd) y Lilac Platinum con ojos claros tienen un valor superior debido al número reducido de camadas anuales.',
  },
  {
    icon: '📜',
    title: 'Pedigree & Derechos de Cría',
    description: 'Los ejemplares de compañía se entregan con pedigree oficial AKC/FCI. Los derechos de cría para programas genéticos internacionales conllevan un ajuste adicional.',
  },
];

export const PriceFactorsHoverGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-6">
      {FACTORS.map((card) => (
        <div
          key={card.title}
          className="h-full w-full p-6 rounded-2xl bg-[#121215] border border-[#27272a] hover:border-purple-500 hover:bg-[#18181b] transition-colors duration-200 flex flex-col"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2 flex items-center gap-2 m-0">
            <span>{card.icon}</span>
            <span>{card.title}</span>
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed m-0 mt-2">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};
