
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
  // شعاع را بر اساس اندازه صفحه تنظیم می‌کنیم تا پیتزاها همیشه در دید باشند
  const radius = 500; 
  const total = pizzas.length;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible">
      {/* 
          مرکز دایره را به بیرون از سمت چپ هدایت می‌کنیم.
          با چرخش دایره حول این نقطه، پیتزاها به صورت تکی وارد کادر می‌شوند.
      */}
      <div 
        className="absolute left-[-450px] top-1/2 -translate-y-1/2 transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ 
          transform: `translateY(-50%) rotate(${activeIndex * -(360 / total)}deg)`
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
                "absolute top-1/2 left-1/2 cursor-pointer transition-all duration-700 origin-center",
                isActive ? "z-20 scale-125" : "z-10 scale-50 opacity-10 grayscale"
              )}
              style={{
                transform: `
                  rotate(${angle}deg) 
                  translateX(${radius}px) 
                  rotate(-${angle}deg)
                  rotate(${activeIndex * (360 / total)}deg)
                  translate(-50%, -50%)
                `
              }}
            >
              <div className="relative group">
                <div className={cn(
                  "absolute inset-0 bg-primary/20 rounded-full blur-[100px] transition-opacity duration-1000",
                  isActive ? "opacity-100" : "opacity-0"
                )} />
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  width={600}
                  height={600}
                  className={cn(
                    "rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] transition-all duration-700",
                    isActive ? "rotate-0 scale-100" : "rotate-45 scale-75"
                  )}
                  data-ai-hint="pizza"
                  priority
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
