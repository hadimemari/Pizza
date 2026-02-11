
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
  const radius = 350; // Distance from center
  const total = pizzas.length;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Decorative center glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
      
      {/* The Wheel */}
      <div 
        className="relative w-full h-full transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ 
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
                "absolute top-1/2 left-1/2 cursor-pointer transition-all duration-500 origin-center",
                isActive ? "z-20 scale-125 brightness-110" : "z-10 scale-75 opacity-60 grayscale-[0.2]"
              )}
              style={{
                transform: `
                  translate(-50%, -50%) 
                  rotate(${angle}deg) 
                  translateY(-${radius}px) 
                  rotate(-${angle}deg)
                  rotate(${activeIndex * (360 / total)}deg)
                `
              }}
            >
              <div className="relative group">
                <div className={cn(
                  "absolute inset-0 bg-primary/20 rounded-full blur-2xl transition-opacity duration-500",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )} />
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  width={350}
                  height={350}
                  className="rounded-full shadow-2xl pizza-glow"
                  data-ai-hint="pizza"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Scroll indicator/Navigation Helpers */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[450px] h-[450px] border-2 border-primary/10 rounded-full border-dashed animate-spin-slow" />
      </div>
    </div>
  );
};
