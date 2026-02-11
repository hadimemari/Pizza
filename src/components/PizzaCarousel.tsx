
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
  // شعاع دایره دوران
  const radius = 750; 
  const total = pizzas.length;
  const angleStep = 360 / total;
  // زمان انتقال ۴ ثانیه برای حرکت فوق‌العاده آرام
  const transitionDuration = "4000ms"; 
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      {/* 
        مرکز دوران: این ظرف دقیقاً در وسط ارتفاع صفحه قرار دارد.
        دوران والد باعث چرخش کل مجموعه می‌شود.
      */}
      <div 
        className="absolute left-[-450px] top-1/2 w-0 h-0"
        style={{ 
          transform: `translateY(-50%) rotate(${-activeIndex * angleStep}deg)`,
          transition: `transform ${transitionDuration} ${easing}`,
          transformOrigin: 'center center'
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
                "absolute top-1/2 left-1/2 cursor-pointer"
              )}
              style={{
                /* 
                   مهندسی دقیق: 
                   1. ابتدا پیتزا را در زاویه مشخص خود در دایره قرار می‌دهیم.
                   2. سپس آن را به اندازه شعاع به بیرون می‌بریم.
                   3. چرخش پیتزا را خنثی می‌کنیم تا همیشه صاف بماند.
                   4. چرخش والد را هم خنثی می‌کنیم تا در هر زاویه‌ای، پیتزا نسبت به ناظر صاف باشد.
                   5. translate(-50%, -50%) مرکز تصویر را دقیقاً روی مدار قرار می‌دهد.
                */
                transform: `
                  rotate(${angle}deg) 
                  translateX(${radius}px) 
                  rotate(${-angle}deg) 
                  rotate(${activeIndex * angleStep}deg)
                  translate(-50%, -50%)
                `,
                transition: `all ${transitionDuration} ${easing}`,
                zIndex: isActive ? 40 : 10,
                opacity: isActive ? 1 : 0.2,
                filter: isActive ? 'blur(0) drop-shadow(0 20px 50px rgba(0,0,0,0.1))' : 'blur(10px) grayscale(0.9)',
                scale: isActive ? '1.1' : '0.5'
              }}
            >
              <div className="relative group perspective-2000">
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                )}
                
                <div className="relative" style={{
                  transform: isActive ? 'scale(1.1)' : 'scale(0.9)',
                  transition: `transform ${transitionDuration} ${easing}`
                }}>
                  <div className="relative w-[600px] h-[600px]">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      className={cn(
                        "object-contain pizza-glow transition-all duration-1000",
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
