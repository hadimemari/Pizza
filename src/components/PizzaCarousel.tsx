
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';

interface PizzaCarouselProps {
  pizzas: Pizza[];
  activeIndex: number;
  onPizzaClick: (index: number) => void;
}

export const PizzaCarousel: React.FC<PizzaCarouselProps> = ({ pizzas, activeIndex, onPizzaClick }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // محاسبات مهندسی برای تراز دقیق
  const radius = isMobile ? 400 : 850; 
  const total = pizzas.length;
  const angleStep = 360 / total;
  
  const transitionDuration = "5000ms"; 
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
  const parentRotation = activeIndex * -angleStep;

  // مرکز دایره در موبایل وسط صفحه و در دسکتاپ سمت چپ کادر
  const centerLeft = isMobile ? '50%' : '-400px';
  const centerTop = isMobile ? '-100px' : '50%';

  return (
    <div className="relative w-full h-full flex items-center justify-center md:justify-start overflow-visible select-none">
      <div 
        className="absolute w-1 h-1 bg-transparent"
        style={{ 
          left: centerLeft, 
          top: centerTop,
          transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)'
        }}
      >
        {/* Chalk Line Path */}
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
          </defs>
          
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

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
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
          
          // فرمول مهندسی برای تراز دقیق در همان نقطه Pizza 1
          // چرخش والد + چرخش معکوس فرزند = تراز صفر
          const currentRotation = angle + parentRotation;

          return (
            <div
              key={pizza.id}
              onClick={() => onPizzaClick(index)}
              className="absolute top-0 left-0 cursor-pointer"
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
                transform: isActive ? 'scale(1.1)' : 'scale(0.8)',
                transition: `transform ${transitionDuration} ${easing}`
              }}>
                <div className={cn(
                  "relative",
                  isMobile ? "w-[280px] h-[280px]" : "w-[520px] h-[520px]"
                )}>
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
