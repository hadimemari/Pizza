
"use client";

import React, { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { type MappedProduct as Pizza } from '@/lib/data-mapper';
import { cn, assetPath } from '@/lib/utils';

interface PizzaCarouselProps {
  pizzas: Pizza[];
  activeIndex: number;
  onPizzaClick: (index: number) => void;
}

export const PizzaCarousel = memo(({ pizzas, activeIndex, onPizzaClick }: PizzaCarouselProps) => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setViewport('mobile');
      else if (width < 1024) setViewport('tablet');
      else setViewport('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adaptive values based on viewport for maximum performance/quality balance
  const radius = viewport === 'mobile' ? 190 : viewport === 'tablet' ? 550 : 850;
  const pizzaSize = viewport === 'mobile' ? 140 : viewport === 'tablet' ? 350 : 520;
  
  const total = pizzas.length;
  const angleStep = total > 0 ? 360 / total : 0;
  const transitionDuration = viewport === 'mobile' ? "600ms" : "1000ms";
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
  
  // High-performance rotation logic
  // For mobile, we flip the direction to feel more natural with touch, for desktop we keep the cinematic rail rotation
  const parentRotation = viewport === 'mobile' 
    ? activeIndex * angleStep 
    : activeIndex * -angleStep;

  const getCenterStyles = () => {
    if (viewport === 'mobile') return { left: '50%', top: '55%', transform: 'translateX(-50%) translate3d(0,0,0)' };
    if (viewport === 'tablet') return { left: '50%', top: '-100px', transform: 'translateX(-50%) translate3d(0,0,0)' };
    return { left: '-400px', top: '50%', transform: 'translateY(-50%) translate3d(0,0,0)' };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center lg:justify-start overflow-visible select-none gpu-accelerated">
      <div 
        className="absolute w-1 h-1 bg-transparent will-change-transform"
        style={getCenterStyles()}
      >
        {/* SVG Rail - High Quality on Desktop only to save mobile battery/performance */}
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
          {viewport === 'desktop' && (
            <>
              <defs>
                <filter id="chalk-effect">
                  <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
              </defs>
              <circle
                cx="0"
                cy="0"
                r={radius}
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeDasharray="10 20"
                filter="url(#chalk-effect)"
                className="opacity-5"
                style={{ transform: `translate(${radius}px, ${radius}px)` }}
              />
            </>
          )}
        </svg>

        {pizzas.map((pizza, index) => {
          // Fixed angle logic for small collections (like Salads)
          const angle = viewport === 'mobile' ? index * -angleStep - 90 : index * angleStep;
          const isActive = index === activeIndex;
          const currentRotation = angle + parentRotation;

          return (
            <div
              key={pizza.id}
              onClick={() => onPizzaClick(index)}
              className="absolute top-0 left-0 cursor-pointer will-change-transform"
              style={{
                transform: `
                  rotate(${currentRotation}deg) 
                  translateX(${radius}px) 
                  rotate(${-currentRotation}deg)
                  translate(-50%, -50%)
                  translate3d(0, 0, 0)
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
                    src={assetPath(pizza.image)}
                    alt={pizza.name}
                    fill
                    className={cn(
                      "object-contain pizza-glow will-change-transform",
                      viewport !== 'mobile' && "animate-spin-slow"
                    )}
                    style={{ 
                      animationDuration: '80s',
                      filter: isActive 
                        ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))' 
                        : 'drop-shadow(0 5px 10px rgba(0,0,0,0.03))'
                    }}
                    unoptimized
                    priority={isActive}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PizzaCarousel.displayName = 'PizzaCarousel';
