
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
  // شعاع بزرگ برای حرکت ملایم دایره‌ای
  const radius = 850; 
  const total = pizzas.length;
  const angleStep = 360 / total;
  
  // زمان انتقال ۵ ثانیه برای وقار و سنگینی مکانیکی
  const transitionDuration = "5000ms"; 
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // زاویه چرخش کل ریل
  const parentRotation = activeIndex * -angleStep;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      {/* 
        مرکز دوران مهندسی شده:
        دقیقاً در ارتفاع ۵۰٪ و در خارج از کادر (سمت چپ) قرار دارد.
        استفاده از transform-origin ثابت برای جلوگیری از نوسان ارتفاع.
      */}
      <div 
        className="absolute left-[-500px] top-1/2 w-1 h-1 bg-transparent"
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
                "absolute top-0 left-0 cursor-pointer"
              )}
              style={{
                /* 
                   فرمول تراز صفر (Zero-Gravity Alignment):
                   1. rotate(angle): پیتزا را در جایگاه اصلی‌اش روی دایره قرار می‌دهد.
                   2. translateX(radius): آن را به فاصله شعاع از مرکز می‌برد.
                   3. rotate(-angle - parentRotation): 
                      -angle: پیتزا را عمود نگه می‌دارد.
                      -parentRotation: دوران والد را خنثی می‌کند تا پیتزای فعال همیشه در تراز افقی مطلق بماند.
                */
                transform: `
                  rotate(${angle}deg) 
                  translateX(${radius}px) 
                  rotate(${-angle - parentRotation}deg)
                  translate(-50%, -50%)
                `,
                transition: `transform ${transitionDuration} ${easing}`,
                zIndex: isActive ? 40 : 10,
                opacity: 1, // تصاویر دیگر محو نمی‌شوند
              }}
            >
              <div className="relative" style={{
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                transition: `transform ${transitionDuration} ${easing}`
              }}>
                <div className="relative w-[500px] h-[500px]">
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
                      filter: isActive ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.12))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))'
                    }}
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
