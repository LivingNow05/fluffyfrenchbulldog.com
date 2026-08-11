import React from 'react';
import { cn } from '@/lib/utils';

export interface VarietyItemProps {
  slug: string;
  nombre: string;
  nombreCorto: string;
  minPrecioUSD: number;
  tagline: string;
}

interface CityVarietyHoverGridProps {
  ciudad: string;
  variedades: VarietyItemProps[];
  className?: string;
}

export const CityVarietyHoverGrid: React.FC<CityVarietyHoverGridProps> = ({
  ciudad,
  variedades,
  className,
}) => {
  return (
    <section className={cn('my-12', className)}>
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
        🎨 Variedades Disponibles para Envío a {ciudad}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {variedades.map((v) => {
          const genTag = v.slug.includes('isabella')
            ? 'bb/dd'
            : v.slug.includes('blue')
            ? 'dd'
            : 'L4/L1';
          const minUSD = v.minPrecioUSD ?? 2300;

          return (
            <a
              href={`/colores/${v.slug}/`}
              key={v.slug}
              className="group block h-full w-full text-decoration-none"
            >
              <div className="h-full w-full rounded-2xl overflow-hidden bg-[#121215] border border-[#27272a] group-hover:border-rose-600 group-hover:bg-[#18181b] transition-colors duration-200 flex flex-col p-4">
                <div className="w-full h-48 rounded-xl overflow-hidden relative mb-3 bg-black">
                  <img
                    src={`/images/variedades/${v.slug}.jpg`}
                    alt={`Bulldog Francés Fluffy ${v.nombre}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-[#121215] border border-[#27272a] text-rose-400 text-[0.72rem] font-semibold px-2.5 py-1 rounded-md">
                    ✨ Manto Sedoso Lh
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors m-0 mb-1">
                  {v.nombreCorto}
                </h3>

                <span className="text-sm font-extrabold text-rose-500 mb-2 block">
                  Desde ${minUSD.toLocaleString('en-US')} USD
                </span>

                <p className="text-xs text-zinc-400 mb-4 leading-relaxed m-0">
                  {v.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[#27272a]">
                  <span className="text-[0.7rem] bg-[#271219] text-rose-400 border border-[#4c1d28] px-2 py-0.5 rounded-md font-medium">
                    ✨ Manto Sedoso Lh
                  </span>
                  <span className="text-[0.7rem] bg-[#271219] text-rose-400 border border-[#4c1d28] px-2 py-0.5 rounded-md font-medium">
                    🧬 Gen {genTag}
                  </span>
                  <span className="text-[0.7rem] bg-[#271219] text-rose-400 border border-[#4c1d28] px-2 py-0.5 rounded-md font-medium">
                    📜 AKC / FCI
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
