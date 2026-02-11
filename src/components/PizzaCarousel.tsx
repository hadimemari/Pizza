
"use client";

import React from 'react';
import Image from 'next/image';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';

interface PizzaCarouselProps {
  pizzas: Pizza[];
  activeIndex: number;
  onPizzaClick: (index: number) => void;
}

export const PizzaCarousel: React.FC<PizzaCarouselProps> = ({ pizzas, activeIndex, onPizzaClick }) => {
  // Increased radius for a more dramatic arc from the side
  const radius = 600; 
  const total = pizzas.length;

  return (
    <div className="relative w-full h-full flex items-center justify-start overflow-visible">
      {/* Center point moved far to the left of the screen container */}
      <div 
        className="absolute transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ 
          left: '-20%', // Shift the pivot point off-screen left
          transform: `rotate(${activeIndex * -(360 / total)}deg)`
        }}
      >
        {pizzas.map((pizza, index) => {
          const angle = index * (360 / total);
          const isActive = index === activeIndex;

          return (
            <div
              key={pizza.id}
              onClick={() => onPizzaClick(index)}
              className={cn(
                "absolute top-0 left-0 cursor-pointer transition-all duration-700 origin-center",
                isActive ? "z-20 scale-150" : "z-10 scale-75 opacity-20 grayscale"
              )}
              style={{
                transform: `
                  rotate(${angle}deg) 
                  translateY(-${radius}px) 
                  rotate(-${angle}deg)
                  rotate(${activeIndex * (360 / total)}deg)
                `
              }}
            >
              <div className="relative group">
                <div className={cn(
                  "absolute inset-0 bg-primary/20 rounded-full blur-3xl transition-opacity duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )} />
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  width={450}
                  height={450}
                  className={cn(
                    "rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700",
                    isActive ? "rotate-0" : "rotate-12"
                  )}
                  data-ai-hint="pizza"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
