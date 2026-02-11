
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ParallaxTextProps {
  text: string;
  activeIndex: number;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({ text, activeIndex }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="transition-transform duration-1000 ease-out flex whitespace-nowrap"
        style={{ transform: `translateX(${-activeIndex * 10}%)` }}
      >
        <span className="text-[25vw] font-black text-primary/5 uppercase leading-none select-none px-10">
          {text}
        </span>
        <span className="text-[25vw] font-black text-primary/5 uppercase leading-none select-none px-10">
          {text}
        </span>
      </div>
      <div 
        className="transition-transform duration-700 ease-out flex whitespace-nowrap mt-[-5vw]"
        style={{ transform: `translateX(${activeIndex * 15}%)` }}
      >
        <span className="text-[15vw] font-black text-accent/5 uppercase leading-none select-none px-10 italic">
          Delicious
        </span>
        <span className="text-[15vw] font-black text-accent/5 uppercase leading-none select-none px-10 italic">
          Authentic
        </span>
      </div>
    </div>
  );
};
