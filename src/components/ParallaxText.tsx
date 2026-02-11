
"use client";

import React from 'react';

interface ParallaxTextProps {
  text: string;
  activeIndex: number;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({ text, activeIndex }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="transition-transform duration-1000 ease-out flex whitespace-nowrap"
        style={{ transform: `translateX(${activeIndex * 10}%)` }} // Adjusted for RTL
      >
        <span className="text-[20vw] font-black text-primary/5 uppercase leading-none select-none px-10">
          {text}
        </span>
        <span className="text-[20vw] font-black text-primary/5 uppercase leading-none select-none px-10">
          {text}
        </span>
      </div>
      <div 
        className="transition-transform duration-700 ease-out flex whitespace-nowrap mt-[-5vw]"
        style={{ transform: `translateX(${-activeIndex * 15}%)` }} // Adjusted for RTL
      >
        <span className="text-[12vw] font-black text-accent/5 uppercase leading-none select-none px-10 italic">
          بسیار لذیذ
        </span>
        <span className="text-[12vw] font-black text-accent/5 uppercase leading-none select-none px-10 italic">
          اصیل و تازه
        </span>
      </div>
    </div>
  );
};
