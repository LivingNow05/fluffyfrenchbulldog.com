import { cn } from "@/lib/utils";
import React from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-6",
        className
      )}
    >
      {items.map((item) => (
        <a
          href={item?.link}
          key={item?.link}
          className="group block h-full w-full text-decoration-none"
        >
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-5 bg-[#121215] border border-[#27272a] group-hover:border-purple-500 group-hover:bg-[#18181b] transition-colors duration-200 flex flex-col justify-between",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-white group-hover:text-purple-400 font-extrabold tracking-tight text-lg mb-2 transition-colors m-0", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-zinc-400 leading-relaxed text-xs font-normal whitespace-pre-line m-0 mt-2",
        className
      )}
    >
      {children}
    </p>
  );
};
