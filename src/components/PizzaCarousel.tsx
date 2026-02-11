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
  // محاسبات دقیق مدار دایره‌ای
  const radius = 650; 
  const total = pizzas.length;
  const angleStep = 360 / total;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      <div 
        className="absolute left-[-450px] top-1/2 -translate-y-1/2 w-0 h-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
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
                "absolute top-1/2 left-1/2 cursor-pointer transition-all duration-1000 origin-center",
                isActive ? "z-30 scale-110" : "z-10 scale-50 opacity-20 blur-[4px] grayscale hover:opacity-40 hover:blur-none"
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
              <div className="relative group perspective-1000">
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                )}
                
                <div className={cn(
                  "relative transition-transform duration-1000 ease-out",
                  isActive ? "rotate-0 scale-110" : "rotate-45 scale-90"
                )}>
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    width={550}
                    height={550}
                    className={cn(
                      "rounded-full pizza-glow transition-all duration-700 drop-shadow-[0_30px_50px_rgba(0,0,0,0.3)]",
                      isActive ? "animate-spin-slow" : ""
                    )}
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
