
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
  const transitionTime = "4000ms"; // همگام با ریل

  return (
    <div className="flex items-center gap-4 p-2">
      {pizzas.map((pizza, index) => (
        <button
          key={pizza.id}
          onClick={() => onSelect(index)}
          className={cn(
            "group flex items-center gap-3 bg-white/40 backdrop-blur-md px-5 py-3 rounded-full border border-black/5 hover:bg-white/80 transition-all shadow-sm"
          )}
          style={{
            transition: `all ${transitionTime} cubic-bezier(0.16, 1, 0.3, 1)`,
            backgroundColor: index === activeIndex ? 'rgba(255, 255, 255, 0.9)' : '',
            boxShadow: index === activeIndex ? '0 10px 30px rgba(0,0,0,0.05)' : '',
            transform: index === activeIndex ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div className="relative w-10 h-10" style={{
            transition: `all ${transitionTime} cubic-bezier(0.16, 1, 0.3, 1)`,
            transform: index === activeIndex ? 'rotate(15deg)' : 'rotate(0)',
          }}>
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-black uppercase tracking-tight" style={{
              color: index === activeIndex ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
            }}>
              {pizza.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
