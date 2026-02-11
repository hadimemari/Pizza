
"use client";

import React from 'react';
import Image from 'next/image';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';

interface PizzaThumbnailsProps {
  pizzas: Pizza[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const PizzaThumbnails: React.FC<PizzaThumbnailsProps> = ({ pizzas, activeIndex, onSelect }) => {
  return (
    <div className="flex items-center gap-4 p-2">
      {pizzas.map((pizza, index) => (
        <button
          key={pizza.id}
          onClick={() => onSelect(index)}
          className="group flex items-center gap-3 transition-all duration-300 bg-white/40 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/40 hover:bg-white/60"
        >
          <div className={cn(
            "relative w-10 h-10 rounded-full overflow-hidden transition-all duration-500 border-2 shadow-sm",
            index === activeIndex 
              ? "border-primary scale-110" 
              : "border-transparent opacity-60 grayscale-[0.3]"
          )}>
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-cover"
              data-ai-hint="pizza thumbnail"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className={cn(
              "text-[10px] font-bold leading-none whitespace-nowrap",
              index === activeIndex ? "text-primary" : "text-muted-foreground"
            )}>
              {pizza.name}
            </span>
            {index === activeIndex && (
              <span className="text-[8px] text-muted-foreground/60 font-bold uppercase mt-1">انتخاب شده</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
