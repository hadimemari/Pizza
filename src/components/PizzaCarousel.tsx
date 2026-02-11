
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
  // محاسبات دقیق مدار دایره‌ای برای چیدمان حرفه‌ای
  const radius = 700; 
  const total = pizzas.length;
  const angleStep = 360 / total;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      {/* Container مرکز دایره در سمت چپ خارج از کادر قرار دارد */}
      <div 
        className="absolute left-[-550px] top-1/2 -translate-y-1/2 w-0 h-0 transition-transform duration-[1500ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
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
                "absolute top-1/2 left-1/2 cursor-pointer transition-all duration-[1200ms] origin-center",
                isActive ? "z-40 scale-110" : "z-10 scale-[0.4] opacity-30 blur-[2px] grayscale hover:opacity-50"
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
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
                )}
                
                <div className={cn(
                  "relative transition-all duration-[1500ms] ease-out",
                  isActive ? "rotate-0 scale-110" : "rotate-[30deg] scale-90"
                )}>
                  <div className="relative w-[580px] h-[580px]">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      className={cn(
                        "object-contain pizza-glow transition-all duration-1000 drop-shadow-[0_40px_70px_rgba(0,0,0,0.4)]",
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
