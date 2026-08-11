import React from 'react';
import { cn } from '@/lib/utils';

export interface VarietyCardData {
  slug: string;
  nombre: string;
  nombreCorto: string;
  minPrecioUSD: number;
  tagline: string;
}

interface ColorHoverGridProps {
  variedades: VarietyCardData[];
  className?: string;
}

export const ColorHoverGrid: React.FC<ColorHoverGridProps> = ({
  variedades,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-6',
        className
      )}
    >
      {variedades.map((r) => {
        const minUSD = r.minPrecioUSD ?? ((r as any).variantes?.length ? Math.min(...(r as any).variantes.map((v: any) => v.precioUSD)) : 2300);

        return (
          <a
            href={`/colores/${r.slug}/`}
            key={r.slug}
            className="group block h-full w-full text-decoration-none"
          >
            <div className="h-full w-full rounded-2xl overflow-hidden bg-[#121215] border border-[#27272a] group-hover:border-rose-600 group-hover:bg-[#18181b] transition-colors duration-200 flex flex-col">
              <div className="w-full h-44 overflow-hidden relative bg-black">
                <img
                  src={`/images/variedades/${r.slug}.jpg`}
                  alt={`Bulldog Francés Fluffy - ${r.nombre}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <span className="absolute top-2.5 right-2.5 bg-[#121215] border border-[#27272a] text-rose-400 font-semibold text-xs px-2.5 py-1 rounded-md">
                  Desde ${minUSD.toLocaleString('en-US')} USD
                </span>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors mb-1 m-0">
                  {r.nombre}
                </h3>
                <p className="text-xs text-zinc-400 font-medium mt-auto leading-relaxed m-0">
                  {r.tagline || (r as any).resumen}
                </p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};
