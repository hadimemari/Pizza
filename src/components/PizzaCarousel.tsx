
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
  // شعاع ریل برای حرکت دایره‌ای بزرگ
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
        دقیقاً در ارتفاع ۵۰٪ فیکس شده است.
        والد دیگر نمی‌چرخد، بلکه محاسبات دوران در سطح فرزندان انجام می‌شود 
        تا از ثبات ۱۰۰٪ در نقطه فرود اطمینان حاصل شود.
      */}
      <div 
        className="absolute left-[-400px] top-1/2 w-1 h-1 bg-transparent"
        style={{ transform: 'translateY(-50%)' }}
      >
        {pizzas.map((pizza, index) => {
          const angle = index * angleStep;
          const isActive = index === activeIndex;

          /* 
             فرمول مهندسی تراز مطلق (Absolute Alignment Formula):
             ما مجموع دوران والد و موقعیت نسبی پیتزا را محاسبه می‌کنیم.
             وقتی index === activeIndex باشد، حاصل (angle + parentRotation) دقیقاً ۰ می‌شود.
             در نتیجه تمام پیتزاهای فعال در زاویه ۰ درجه و با فاصله radius از مرکز قرار می‌گیرند.
          */
          const currentRotation = angle + parentRotation;

          return (
            <div
              key={pizza.id}
              onClick={() => onPizzaClick(index)}
              className={cn(
                "absolute top-0 left-0 cursor-pointer"
              )}
              style={{
                transform: `
                  rotate(${currentRotation}deg) 
                  translateX(${radius}px) 
                  rotate(${-currentRotation}deg)
                  translate(-50%, -50%)
                `,
                transition: `transform ${transitionDuration} ${easing}`,
                zIndex: isActive ? 40 : 10,
              }}
            >
              <div className="relative" style={{
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                transition: `transform ${transitionDuration} ${easing}`
              }}>
                <div className="relative w-[520px] h-[520px]">
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    fill
                    className={cn(
                      "object-contain pizza-glow animate-spin-slow"
                    )}
                    style={{ 
                      animationDuration: '60s',
                      filter: isActive 
                        ? 'drop-shadow(0 40px 80px rgba(0,0,0,0.15))' 
                        : 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))'
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
