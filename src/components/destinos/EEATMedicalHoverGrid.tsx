import React from 'react';
import { cn } from '@/lib/utils';

export interface EEATMedicalHoverGridProps {
  ciudad: string;
  pais: string;
  className?: string;
}

const MEDICAL_CARDS = [
  {
    icon: '📋',
    title: 'Examen de Salud pre-vuelo',
    description: 'Inspección cardiorrespiratoria rigurosa y auscultación veterinaria realizada máximo 24 horas antes del embarque hacia tu ciudad.',
  },
  {
    icon: '💉',
    title: 'Esquema de Vacunación completo',
    description: 'Carnet oficial con vacunas puestas al día (PUPPY, Quíntuple), desparasitación interna y microchip ISO homologado.',
  },
  {
    icon: '🛡️',
    title: 'Garantía Escrita de 2 Años',
    description: 'Respaldo genético legal por contrato ante cualquier condición congénita o hereditaria propia de la raza.',
  },
];

export const EEATMedicalHoverGrid: React.FC<EEATMedicalHoverGridProps> = ({
  ciudad,
  pais,
  className,
}) => {
  return (
    <section className={cn('my-10 p-6 md:p-8 rounded-2xl bg-[#121215] border border-[#27272a]', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[#27272a]">
        <div className="w-14 h-14 rounded-2xl bg-[#1f1032] border border-[#3b1964] text-purple-400 flex items-center justify-center font-black text-2xl shrink-0">
          🩺
        </div>
        <div>
          <h3 className="m-0 text-xl font-bold text-white tracking-tight">
            Revisión Médica & Autoridad Veterinaria EEAT
          </h3>
          <p className="m-0 mt-1 text-sm text-zinc-400 leading-relaxed">
            Supervisión profesional garantizada para entregas en{' '}
            <strong className="text-purple-400 font-semibold">{ciudad}, {pais}</strong> · Reg. Prof. M.V. 14892 · Certificación ACCC / AKC / FCI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MEDICAL_CARDS.map((card) => (
          <div
            key={card.title}
            className="p-5 rounded-2xl bg-[#18181b] border border-[#27272a] flex flex-col"
          >
            <div className="font-extrabold text-base mb-2 text-purple-400 flex items-center gap-2">
              <span>{card.icon}</span>
              <span>{card.title}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed m-0">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
