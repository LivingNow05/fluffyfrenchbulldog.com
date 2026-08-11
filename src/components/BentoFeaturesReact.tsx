import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

export const BentoFeaturesReact = () => {
  return (
    <BentoGrid className="max-w-7xl mx-auto">
      {/* Tarjeta 1: Genética (Grande, span 2) */}
      <BentoGridItem
        title="Especialistas en el Gen Fluffy"
        description="Dominamos la cría de cachorros portadores y visuales del gen de pelo largo (L4), logrando mantos afelpados incomparables en colores exóticos como Blue, Isabella, Lilac, Cocoa y Merlé."
        icon={<span className="text-3xl">🧬</span>}
        className="md:col-span-2 transition-colors duration-200 bg-[#121215] border border-[#27272a] hover:border-rose-600 hover:bg-[#18181b]"
        header={
          <div className="flex flex-1 w-full h-48 md:h-64 rounded-xl overflow-hidden relative border border-[#27272a] bg-black">
            <img 
              src="/images/variedades/fluffy-lilac.jpg" 
              alt="Cachorro Bulldog Francés Fluffy" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover/bento:scale-102" 
            />
          </div>
        }
      />

      {/* Tarjeta 2: Envíos VIP */}
      <BentoGridItem
        title="Envíos VIP en Cabina"
        description='Entrega personalizada por "Flight Nannies" directo en tus brazos, en más de 100 aeropuertos a nivel global sin escalas en bodega.'
        icon={<span className="text-3xl">✈️</span>}
        className="md:col-span-1 transition-colors duration-200 bg-[#121215] border border-[#27272a] hover:border-rose-600 hover:bg-[#18181b]"
        header={
          <div className="flex flex-1 w-full h-32 rounded-xl bg-[#18181b] border border-[#27272a] items-center justify-center">
            <span className="text-5xl">✈️</span>
          </div>
        }
      />

      {/* Tarjeta 3: Certificación y Pedigree */}
      <BentoGridItem
        title="Pedigree AKC / FCI"
        description="Linajes puros certificados por el American Kennel Club y la Fédération Cynologique Internationale, asegurando morfología de campeones."
        icon={<span className="text-3xl">📜</span>}
        className="md:col-span-1 transition-colors duration-200 bg-[#121215] border border-[#27272a] hover:border-rose-600 hover:bg-[#18181b]"
        header={
          <div className="flex flex-1 w-full h-32 rounded-xl bg-[#18181b] border border-[#27272a] items-center justify-center">
            <span className="text-5xl">📜</span>
          </div>
        }
      />

      {/* Tarjeta 4: Garantía Genética de 2 Años */}
      <BentoGridItem
        title="Garantía Genética de 2 Años"
        description="Nuestros cachorros pasan rigurosos controles veterinarios y pruebas de ADN. Tu inversión está respaldada por una garantía escrita inigualable en el mercado de criadores élite."
        icon={<span className="text-3xl">🏥</span>}
        className="md:col-span-2 transition-colors duration-200 bg-[#121215] border border-[#27272a] hover:border-rose-600 hover:bg-[#18181b]"
        header={
          <div className="flex flex-1 w-full h-32 rounded-xl bg-[#18181b] border border-[#27272a] items-center justify-center">
            <div className="w-24 h-24 rounded-xl bg-rose-600 flex items-center justify-center text-center text-[0.72rem] font-black text-white border border-rose-500">
              100% HEALTH<br/>GUARANTEE
            </div>
          </div>
        }
      />
    </BentoGrid>
  );
};
