import React from 'react';

interface MovingBorderBoxProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  borderGradient?: string;
}

export const MovingBorderBox: React.FC<MovingBorderBoxProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full p-6 text-left bg-[#121215] text-white font-normal justify-start items-start leading-relaxed border border-[#27272a] rounded-2xl my-6 ${className}`}>
      <div className="w-full text-zinc-200 text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
};
