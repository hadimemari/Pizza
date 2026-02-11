
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
          className={cn(
            "group flex items-center gap-3 transition-all duration-500 bg-white/30 backdrop-blur-xl px-4 py-3 rounded-[2rem] border border-white/40 hover:bg-white/60 shadow-lg shadow-black/5",
            index === activeIndex && "bg-white/80 ring-2 ring-primary/40 scale-105"
          )}
        >
          <div className={cn(
            "relative w-12 h-12 rounded-full transition-all duration-700",
            index === activeIndex 
              ? "scale-110 rotate-[15deg]" 
              : "opacity-60 grayscale-[0.5]"
          )}>
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-contain drop-shadow-md"
              unoptimized
            />
          </div>
          <div className="flex flex-col items-start pr-1">
            <span className={cn(
              "text-xs font-black leading-none whitespace-nowrap uppercase tracking-tight",
              index === activeIndex ? "text-primary" : "text-muted-foreground"
            )}>
              {pizza.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
