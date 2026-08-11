"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";

export const HeroParallax = ({
  products,
  whatsappHref = "https://wa.me/573128375043",
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  whatsappHref?: string;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header whatsappHref={whatsappHref} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ whatsappHref }: { whatsappHref?: string }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-4 w-full left-0 top-0 flex flex-col items-center text-center">
      {/* Insignias AKC / FCI Certificadas */}
      <div className="inline-flex items-center gap-2 bg-rose-950/40 border border-rose-800/40 rounded-full px-5 py-2 mb-6 flex-wrap justify-center text-xs md:text-sm font-bold text-rose-300">
        <span>📜 Pedigree Oficial AKC & FCI</span>
        <span className="text-rose-400 opacity-60">•</span>
        <span>🧬 ADN 100% Pura Raza</span>
        <span className="text-rose-400 opacity-60">•</span>
        <span>🏥 Garantía Genética 2 Años</span>
      </div>

      {/* Titular Masivo */}
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-display">
        Perros <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 bg-clip-text text-transparent">Bulldog Francés Fluffy</span>
      </h1>

      {/* Párrafo Descriptivo Editorial */}
      <p className="max-w-3xl text-base md:text-xl text-neutral-300 leading-relaxed mb-8">
        Especialistas en la crianza de linajes puros de pelaje afelpado exótico. Variedades Fluffy Blue, Visual Isabella, Lilac, Cocoa y Merlé con pedigree internacional y protocolo de entrega VIP con niñera aérea en cabina.
      </p>

      {/* Botones de Acción Principales */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <a
          href={whatsappHref || "https://wa.me/573128375043"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar por WhatsApp"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-600/30 transition duration-200 hover:-translate-y-1 text-decoration-none"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          <span>Consultar Disponibilidad por WhatsApp</span>
        </a>
        <a
          href="/precios-bulldog-fluffy/"
          className="inline-flex items-center gap-2 bg-rose-950/50 hover:bg-rose-900/60 text-white font-bold px-6 py-4 rounded-full border border-rose-800/50 transition duration-200 hover:-translate-y-0.5 text-decoration-none"
        >
          <span>Ver Catálogo & Precios 2026</span>
          <span>→</span>
        </a>
      </div>

      {/* Grid de Contador Estadístico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-4">
        <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-rose-500 font-display">5</span>
          <span className="text-xs md:text-sm font-medium text-zinc-400">Variedades Exóticas</span>
        </div>
        <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-rose-500 font-display">+100</span>
          <span className="text-xs md:text-sm font-medium text-zinc-400">Ciudades con Niñera Aérea</span>
        </div>
        <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-rose-500 font-display">100%</span>
          <span className="text-xs md:text-sm font-medium text-zinc-400">Garantía Genética Certificada</span>
        </div>
        <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-rose-500 font-display">+12</span>
          <span className="text-xs md:text-sm font-medium text-zinc-400">Países con Envíos VIP</span>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 rounded-2xl overflow-hidden border border-[#27272a]"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0 transition duration-500 group-hover/product:scale-105"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none transition duration-300"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold text-lg pointer-events-none transition duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};

