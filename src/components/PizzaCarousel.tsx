
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
  // شعاع دقیق دایره ریل
  const radius = 800; 
  const total = pizzas.length;
  const angleStep = 360 / total;
  
  // زمان انتقال ۴ ثانیه برای حرکت بسیار آرام و مکانیکی
  const transitionDuration = "4000ms"; 
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // زاویه فعلی والد برای خنثی‌سازی در فرزندان
  const parentRotation = activeIndex * -angleStep;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      {/* 
        مرکز دوران: در ارتفاع دقیق ۵۰٪ قرار دارد.
        X تراز شده تا لبه دایره در بخش طلایی سمت چپ قرار بگیرد.
      */}
      <div 
        className="absolute left-[-550px] top-1/2 w-0 h-0"
        style={{ 
          transform: `translateY(-50%) rotate(${parentRotation}deg)`,
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
                   مهندسی دقیق تراز عمودی:
                   1. rotate(angle): پیتزا را در جایگاه اصلی‌اش روی ریل قرار می‌دهد.
                   2. translateX(radius): آن را به فاصله شعاع از مرکز می‌برد.
                   3. rotate(-angle - parentRotation): 
                      -angle: چرخش مرحله ۱ را خنثی می‌کند تا پیتزا عمود بماند.
                      -parentRotation: چرخش لحظه‌ای کل ریل را خنثی می‌کند.
                   نتیجه: پیتزا در هر زاویه‌ای که باشد، همیشه صاف و در یک تراز ارتفاعی دقیق نسبت به افق دیده می‌شود.
                */
                transform: `
                  rotate(${angle}deg) 
                  translateX(${radius}px) 
                  rotate(${-angle - parentRotation}deg)
                  translate(-50%, -50%)
                `,
                transition: `transform ${transitionDuration} ${easing}, opacity ${transitionDuration} ease`,
                zIndex: isActive ? 40 : 10,
                opacity: isActive ? 1 : 0.6, // عدم محو شدن کامل، مانند یک ریل فیزیکی
                scale: isActive ? '1' : '0.8'
              }}
            >
              <div className="relative group">
                <div className="relative" style={{
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: `transform ${transitionDuration} ${easing}`
                }}>
                  <div className="relative w-[550px] h-[550px]">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      className={cn(
                        "object-contain pizza-glow",
                        isActive ? "animate-spin-slow" : ""
                      )}
                      style={{ 
                        animationDuration: '60s',
                        filter: isActive ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))' : 'none'
                      }}
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
