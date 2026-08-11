import React from 'react';

export const FacilityShowcase3D: React.FC = () => {
  return (
    <div className="w-full my-8 p-8 bg-[#121215] border border-[#27272a] rounded-3xl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <span className="text-rose-400 font-extrabold text-xs tracking-widest uppercase mb-2 block">
            🏡 Instalaciones VIP & Ética de Crianza
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 m-0">
            Entorno Climatizado y Estimulación Temprana
          </h3>
          <div className="text-zinc-300 text-sm sm:text-base leading-relaxed space-y-3">
            <p className="m-0 mb-3">
              Nuestras instalaciones están acondicionadas con control climático constante, áreas verdes de esparcimiento y protocolos higiénicos estrictos para garantizar la salud óptima de nuestras camadas.
            </p>
            <p className="m-0">
              Cada cachorro se entrega con esquema de vacunación completo, desparasitación al día, microchip ISO registrado y acompañamiento posventa continuo.
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto shrink-0 flex justify-center">
          <div className="p-6 bg-[#271219] border border-[#4c1d28] rounded-2xl text-center max-w-xs">
            <span className="text-5xl block mb-3">🐶🏆</span>
            <span className="text-white font-bold text-sm block">Excelencia Canina</span>
            <span className="text-rose-400 text-xs">Criterio genético de clase mundial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
