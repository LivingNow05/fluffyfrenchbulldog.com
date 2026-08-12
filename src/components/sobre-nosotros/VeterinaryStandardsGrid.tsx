import React from 'react';

const standards = [
  {
    icon: '🧬',
    label: 'Panel de ADN Certificado',
    value:
      'Todos nuestros reproductores cuentan con análisis genético de laboratorio para descartar cataratas juveniles, mielopatía degenerativa y cistinuria.',
  },
  {
    icon: '❤️',
    label: 'Salud Cardíaca & Articular',
    value:
      'Monitoreo veterinario constante con ecocardiogramas y evaluaciones de caderas antes de cada cruce.',
  },
  {
    icon: '🏡',
    label: 'Socialización Temprana',
    value:
      'Cachorros criados en ambiente familiar, expuestos a estímulos sensoriales, ruidos cotidianos y convivencia afectuosa.',
  },
  {
    icon: '✈️',
    label: 'Envíos con Niñera Aérea',
    value:
      'Garantizamos que tu cachorro viaje cómodo en cabina climatizada hasta tu ciudad en Colombia, México, EE. UU. o España.',
  },
];

export const VeterinaryStandardsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
      {standards.map((std) => (
        <div
          key={std.label}
          className="w-full h-auto p-6 bg-[#121215] border border-[#27272a] hover:border-purple-500 hover:bg-[#18181b] rounded-2xl flex flex-col justify-between transition-colors duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl p-3 bg-[#1f1032] rounded-xl border border-[#3b1964] shrink-0 text-purple-400">
              {std.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 m-0">
                {std.label}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed m-0">
                {std.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
