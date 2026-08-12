import React from 'react';

export interface HubCard3DProps {
  ciudad: string;
  pais: string;
  flag: string;
  aeropuerto: string;
  moneda: string;
  url: string;
}

export const HubCard3D: React.FC<HubCard3DProps> = ({
  ciudad,
  pais,
  flag,
  aeropuerto,
  moneda,
  url,
}) => {
  return (
    <div className="w-full h-auto p-6 bg-[#121215] border border-[#27272a] hover:border-purple-500 rounded-2xl flex flex-col justify-between transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-extrabold text-white tracking-tight m-0">
            {ciudad}
          </h3>
          <span className="text-3xl">
            {flag}
          </span>
        </div>
        <div className="text-purple-400 text-xs font-semibold flex items-center gap-1.5 mb-3 bg-[#1f1032] px-3 py-1.5 rounded-lg border border-[#3b1964] w-fit">
          <span>✈️</span> <span>{aeropuerto}</span>
        </div>
        <p className="text-zinc-400 text-xs leading-relaxed mb-6">
          Entrega VIP presencial en cabina de pasajeros con niñera aérea dedicada hacia {pais} ({moneda}).
        </p>
      </div>
      <a
        href={url}
        className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition-colors block tracking-wide text-decoration-none"
      >
        Ver disponibilidad & historia local →
      </a>
    </div>
  );
};
