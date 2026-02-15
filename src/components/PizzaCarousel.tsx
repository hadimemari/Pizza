
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

  // ─── Mobile: Clean single-item display (no circular carousel) ───
  if (viewport === 'mobile') {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        {pizzas.map((pizza, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={pizza.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: isActive ? 1 : 0,
                transform: `scale(${isActive ? 1 : 0.85})`,
                transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div className="relative" style={{ width: 195, height: 195 }}>
                <Image
                  src={assetPath(pizza.image)}
                  alt={pizza.name}
                  fill
                  className="object-contain"
                  style={{
                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))',
                  }}
                  unoptimized
                  priority={isActive}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ─── Desktop & Tablet: Circular carousel ───
  const radius = viewport === 'tablet' ? 550 : 850;
  const pizzaSize = viewport === 'tablet' ? 350 : 520;

  const total = pizzas.length;
  const angleStep = total > 0 ? 360 / total : 0;
  const transitionDuration = "1000ms";
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  const parentRotation = activeIndex * -angleStep;

  const getCenterStyles = () => {
    if (viewport === 'tablet') return { left: '50%', top: '-100px', transform: 'translateX(-50%) translate3d(0,0,0)' };
    return { left: '-400px', top: '50%', transform: 'translateY(-50%) translate3d(0,0,0)' };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center lg:justify-start overflow-visible select-none gpu-accelerated">
      <div
        className="absolute w-1 h-1 bg-transparent will-change-transform"
        style={getCenterStyles()}
      >
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
          const angle = index * angleStep;
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
                      "object-contain pizza-glow animate-spin-slow will-change-transform"
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
