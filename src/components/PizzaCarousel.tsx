
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
  const radius = 700; 
  const total = pizzas.length;
  const angleStep = 360 / total;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      <div 
        className="absolute left-[-550px] top-1/2 -translate-y-1/2 w-0 h-0 transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ 
          transform: `translateY(-50%) rotate(${-activeIndex * angleStep}deg)`
        }}
      >
        {pizzas.map((pizza, index) => {
          const angle = index * angleStep;
          const isActive = index === activeIndex;

          return (
            <div
              key={pizza.id}
              onClick={() => onPizzaClick(index)}
              className={cn(
                "absolute top-1/2 left-1/2 cursor-pointer transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-center",
                isActive ? "z-40 scale-110" : "z-10 scale-[0.4] opacity-30 blur-[4px] grayscale hover:opacity-50"
              )}
              style={{
                transform: `
                  rotate(${angle}deg) 
                  translateX(${radius}px) 
                  rotate(${-angle}deg) 
                  rotate(${activeIndex * angleStep}deg)
                  translate(-50%, -50%)
                `
              }}
            >
              <div className="relative group perspective-2000">
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[140px] animate-pulse transition-opacity duration-[2000ms]" />
                )}
                
                <div className={cn(
                  "relative transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive ? "rotate-0 scale-110" : "rotate-[45deg] scale-90"
                )}>
                  <div className="relative w-[580px] h-[580px]">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      className={cn(
                        "object-contain pizza-glow transition-all duration-[2000ms] drop-shadow-[0_45px_75px_rgba(0,0,0,0.35)]",
                        isActive ? "animate-spin-slow" : ""
                      )}
                      unoptimized
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
