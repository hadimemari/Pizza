
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
  // شعاع دقیق ریل برای حرکت دایره‌ای
  const radius = 850; 
  const total = pizzas.length;
  const angleStep = 360 / total;
  
  // زمان انتقال ۵ ثانیه برای وقار و سنگینی مکانیکی (Ultra-Smooth)
  const transitionDuration = "5000ms"; 
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // زاویه چرخش کل ریل
  const parentRotation = activeIndex * -angleStep;

  return (
    <div className="relative w-full h-full flex items-center overflow-visible select-none">
      {/* 
        مرکز دوران مهندسی شده:
        دقیقاً در ارتفاع ۵۰٪ فیکس شده است.
      */}
      <div 
        className="absolute left-[-400px] top-1/2 w-1 h-1 bg-transparent"
        style={{ transform: 'translateY(-50%)' }}
      >
        {/* مسیر دایره‌ای با استایل خط گچی کارتونی */}
        <svg 
          className="absolute pointer-events-none overflow-visible" 
          width={radius * 2} 
          height={radius * 2} 
          style={{ 
            left: 0, 
            top: 0, 
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        >
          <defs>
            <filter id="chalk-effect">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0,0,0,0.15)" />
            </marker>
          </defs>
          
          {/* دایره اصلی مسیر */}
          <circle 
            cx="0" 
            cy="0" 
            r={radius} 
            fill="none" 
            stroke="black" 
            strokeWidth="3" 
            strokeDasharray="20 30" 
            filter="url(#chalk-effect)"
            className="opacity-10"
            style={{ transform: `translate(${radius}px, ${radius}px)` }}
          />

          {/* فلش‌های جهت‌نما پاد ساعت‌گرد */}
          {[0, 45, 90, 135, 180].map((angle) => (
            <g key={angle} style={{ transform: `translate(${radius}px, ${radius}px) rotate(${angle}deg)` }}>
              <path
                d={`M ${radius - 20} -40 L ${radius} -60 L ${radius + 20} -40`}
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#chalk-effect)"
                className="opacity-10"
              />
            </g>
          ))}
        </svg>

        {pizzas.map((pizza, index) => {
          const angle = index * angleStep;
          const isActive = index === activeIndex;

          /* 
             فرمول مهندسی تراز مطلق:
             ترکیب چرخش والد و فرزند برای رسیدن به نقطه فرود دقیقاً یکسان (Y=0).
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
