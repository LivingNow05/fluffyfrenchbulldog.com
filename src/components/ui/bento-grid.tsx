import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-5 md:auto-rows-[19rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-2xl border border-[#27272a] bg-[#121215] p-5 transition-colors duration-200 hover:border-purple-500 hover:bg-[#18181b]",
        className,
      )}
    >
      {header}
      <div>
        {icon}
        <div className="mt-2 mb-1 font-bold text-white text-lg">
          {title}
        </div>
        <div className="text-xs font-normal text-zinc-400 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
