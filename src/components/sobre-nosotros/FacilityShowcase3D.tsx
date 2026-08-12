import React from 'react';

export const FacilityShowcase3D: React.FC = () => {
  return (
    <div className="w-full my-8 p-8 bg-[#121215] border border-[#27272a] rounded-3xl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <span className="text-purple-400 font-extrabold text-xs tracking-widest uppercase mb-2 block">
            🏡 Instalaciones y Entorno
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight m-0">
            Ambiente Controlado y Cuidado Profesional
          </h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed m-0">
            Nuestros criaderos cuentan con zonas climatizadas de maternidad, espacios de socialización al aire libre y monitoreo médico las 24 horas del día.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-zinc-300">
            <span className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg">
              🌱 Climatización inteligente
            </span>
            <span className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg">
              🩺 Maternidad veterinaria
            </span>
            <span className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg">
              🐾 Socialización temprana
            </span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#27272a] bg-[#121215] p-2">
          <img
            src="/images/fluffy-showcase-hero.jpg"
            alt="Instalaciones Criadero Dinastía Bulldog Fluffy"
            className="w-full h-72 sm:h-80 object-cover rounded-xl"
          />
          <div className="p-3 text-center">
            <span className="text-purple-400 text-xs">Criterio genético de clase mundial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
