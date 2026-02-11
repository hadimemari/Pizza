
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
        className="absolute left-[-550px] top-1/2 -translate-y-1/2 w-0 h-0"
        style={{ 
          transform: `translateY(-50%) rotate(${-activeIndex * angleStep}deg)`,
          transition: 'transform 3000ms cubic-bezier(0.16, 1, 0.3, 1)'
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
                "absolute top-1/2 left-1/2 cursor-pointer origin-center"
              )}
              style={{
                transform: `
                  rotate(${angle}deg) 
                  translateX(${radius}px) 
                  rotate(${-angle}deg) 
                  rotate(${activeIndex * angleStep}deg)
                  translate(-50%, -50%)
                `,
                transition: 'all 3000ms cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isActive ? 40 : 10,
                opacity: isActive ? 1 : 0.3,
                filter: isActive ? 'blur(0)' : 'blur(4px) grayscale(0.5)',
                scale: isActive ? '1.1' : '0.4'
              }}
            >
              <div className="relative group perspective-2000">
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[140px] animate-pulse" />
                )}
                
                <div className="relative" style={{
                  transform: isActive ? 'rotate(0) scale(1.1)' : 'rotate(45deg) scale(0.9)',
                  transition: 'transform 3000ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <div className="relative w-[580px] h-[580px]">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      className={cn(
                        "object-contain pizza-glow drop-shadow-[0_45px_75px_rgba(0,0,0,0.35)]",
                        isActive ? "animate-spin-slow" : ""
                      )}
                      style={{ animationDuration: '60s' }}
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
