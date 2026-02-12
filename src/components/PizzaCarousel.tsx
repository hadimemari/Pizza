
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
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setViewport('mobile');
      else if (width < 1024) setViewport('tablet');
      else setViewport('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // محاسبات دقیق مهندسی برای هر دستگاه
  const radius = viewport === 'mobile' ? 320 : viewport === 'tablet' ? 550 : 850;
  const pizzaSize = viewport === 'mobile' ? 220 : viewport === 'tablet' ? 350 : 520;
  
  const total = pizzas.length;
  const angleStep = 360 / total;
  const transitionDuration = "5000ms"; 
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
  
  // در موبایل چرخش ساعت‌گرد (activeIndex * angleStep) و در بقیه پاد ساعت‌گرد
  const parentRotation = viewport === 'mobile' 
    ? activeIndex * angleStep 
    : activeIndex * -angleStep;

  const getCenterStyles = () => {
    if (viewport === 'mobile') return { left: '50%', top: '350px', transform: 'translateX(-50%)' };
    if (viewport === 'tablet') return { left: '50%', top: '-120px', transform: 'translateX(-50%)' };
    return { left: '-400px', top: '50%', transform: 'translateY(-50%)' };
  };

  const centerStyles = getCenterStyles();

  return (
    <div className="relative w-full h-full flex items-center justify-center lg:justify-start overflow-visible select-none">
      <div 
        className="absolute w-1 h-1 bg-transparent"
        style={centerStyles}
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
            strokeWidth="2" 
            strokeDasharray="15 25" 
            filter="url(#chalk-effect)"
            className="opacity-10"
            style={{ transform: `translate(${radius}px, ${radius}px)` }}
          />

          {[0, 90, 180, 270].map((angle) => (
            <g key={angle} style={{ transform: `translate(${radius}px, ${radius}px) rotate(${angle}deg)` }}>
              <path
                d={`M ${radius - 15} -30 L ${radius} -45 L ${radius + 15} -30`}
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#chalk-effect)"
                className="opacity-10"
              />
            </g>
          ))}
        </svg>

        {pizzas.map((pizza, index) => {
          const angle = viewport === 'mobile' 
            ? index * -angleStep - 90 // در موبایل شروع از بالا (ساعت ۱۲)
            : index * angleStep;

          const isActive = index === activeIndex;
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
                transform: isActive ? 'scale(1.1)' : 'scale(0.85)',
                transition: `transform ${transitionDuration} ${easing}`
              }}>
                <div className="relative" style={{ width: pizzaSize, height: pizzaSize }}>
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
