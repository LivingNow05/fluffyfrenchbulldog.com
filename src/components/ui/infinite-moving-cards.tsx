"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export interface InfiniteMovingCardItem {
  quote: string;
  name: string;
  title: string;
  img?: string;
  avatar?: string;
  colorBg?: string;
  ciudad?: string;
  variedad?: string;
  rating?: number;
  verified?: boolean;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: InfiniteMovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[340px] max-w-full shrink-0 rounded-2xl border border-[#27272a] bg-[#121215] p-5 md:w-[410px] transition-colors duration-200 hover:border-purple-500 hover:bg-[#18181b] flex flex-col gap-3"
            key={`${item.name}-${idx}`}
          >
            {item.img && (
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-black">
                <img
                  src={item.img}
                  alt={`Bulldog Fluffy de ${item.name}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-102"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              {item.avatar && (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-base font-extrabold text-white shrink-0"
                  style={{ backgroundColor: item.colorBg || "#9333ea" }}
                >
                  {item.avatar}
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base leading-snug">{item.name}</span>
                  {item.verified !== false && (
                    <span className="rounded-md bg-[#121215] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 border border-[#27272a]">
                      ✓ Verificado
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400">{item.title}</span>
              </div>
            </div>

            <div className="text-xs tracking-widest text-amber-400">⭐⭐⭐⭐⭐</div>

            <p className="text-sm italic leading-relaxed text-zinc-300 flex-grow m-0">
              "{item.quote}"
            </p>

            {item.variedad && (
              <span className="self-start rounded-full bg-purple-500/10 border border-purple-500/25 px-3 py-1 text-xs font-bold text-amber-300">
                Variedad: {item.variedad}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

