
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
    <div className="flex items-center justify-center gap-6 mb-8 px-4 py-2">
      {pizzas.map((pizza, index) => (
        <button
          key={pizza.id}
          onClick={() => onSelect(index)}
          className="group flex flex-col items-center gap-2 transition-all duration-300"
        >
          <div className={cn(
            "relative w-16 h-16 rounded-full overflow-hidden transition-all duration-500 border-2",
            index === activeIndex 
              ? "border-primary scale-110 shadow-lg shadow-primary/20" 
              : "border-transparent opacity-60 hover:opacity-100 grayscale-[0.5] hover:grayscale-0"
          )}>
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-cover"
              data-ai-hint="pizza thumbnail"
            />
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-tighter transition-colors max-w-[70px] text-center leading-none",
            index === activeIndex ? "text-primary" : "text-muted-foreground"
          )}>
            {pizza.name}
          </span>
        </button>
      ))}
    </div>
  );
};
