import React from 'react';

interface Affiliations3DGridProps {
  afiliaciones: string[];
}

export const Affiliations3DGrid: React.FC<Affiliations3DGridProps> = ({ afiliaciones }) => {
  const detailsMap: Record<string, string> = {
    AKC: 'American Kennel Club - Pedigree oficial de pureza racial internacional y registro genealógico.',
    FCI: 'Fédération Cynologique Internationale - Reconocimiento y homologación canina a nivel mundial.',
    ACCC: 'Asociación Canófila Colombiana - Certificación nacional de origen y microchip oficial ISO.',
    'Pedigree Internacional': 'Transferencia de propiedad internacional con validez en EE. UU., México y Europa.',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
      {afiliaciones.map((a) => (
        <div
          key={a}
          className="w-full h-auto p-6 bg-[#121215] border border-[#27272a] hover:border-rose-600 hover:bg-[#18181b] rounded-2xl flex flex-col justify-between transition-colors duration-200"
        >
          <div>
            <span className="text-4xl mb-3 block">📜</span>
            <h3 className="text-xl font-bold text-white mb-2 m-0">
              Registro Oficial {a}
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed m-0 mt-2">
              {detailsMap[a] || 'Certificación genética y pedigree oficial verificado.'}
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-xs font-semibold text-rose-400">
            Verificado por laboratorio ✓
          </span>
        </div>
      ))}
    </div>
  );
};
