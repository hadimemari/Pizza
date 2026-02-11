
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
  const transitionTime = "4000ms";

  return (
    <div className="flex items-center gap-4 p-2">
      {pizzas.map((pizza, index) => (
        <button
          key={pizza.id}
          onClick={() => onSelect(index)}
          className={cn(
            "group flex items-center gap-3 bg-white/30 backdrop-blur-xl px-4 py-3 rounded-[2rem] border border-white/40 hover:bg-white/60 shadow-lg shadow-black/5"
          )}
          style={{
            transition: `all ${transitionTime} cubic-bezier(0.16, 1, 0.3, 1)`,
            backgroundColor: index === activeIndex ? 'rgba(255, 255, 255, 0.8)' : '',
            boxShadow: index === activeIndex ? '0 0 0 2px rgba(230, 126, 34, 0.4)' : '',
            scale: index === activeIndex ? '1.05' : '1'
          }}
        >
          <div className="relative w-12 h-12 rounded-full" style={{
            transition: `all ${transitionTime} cubic-bezier(0.16, 1, 0.3, 1)`,
            transform: index === activeIndex ? 'scale(1.1) rotate(15deg)' : '',
            opacity: index === activeIndex ? '1' : '0.6',
            filter: index === activeIndex ? '' : 'grayscale(0.5)'
          }}>
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-contain drop-shadow-md"
              unoptimized
            />
          </div>
          <div className="flex flex-col items-start pr-1">
            <span className="text-xs font-black leading-none whitespace-nowrap uppercase tracking-tight" style={{
              transition: `color ${transitionTime} cubic-bezier(0.16, 1, 0.3, 1)`,
              color: index === activeIndex ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
            }}>
              {pizza.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
