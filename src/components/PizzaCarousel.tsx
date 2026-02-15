
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

  // ─── Adaptive parameters per viewport ───
  const radius = viewport === 'mobile' ? 160 : viewport === 'tablet' ? 550 : 850;
  const pizzaSize = viewport === 'mobile' ? 135 : viewport === 'tablet' ? 350 : 520;
  const spinSpeed = viewport === 'mobile' ? '120s' : '80s';

  const total = pizzas.length;
  const angleStep = total > 0 ? 360 / total : 0;
  const transitionDuration = viewport === 'mobile' ? '700ms' : '1000ms';
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // Rotation: mobile items come from bottom (clockwise), desktop from right
  const parentRotation = viewport === 'mobile'
    ? activeIndex * angleStep
    : activeIndex * -angleStep;

  const getCenterStyles = (): React.CSSProperties => {
    if (viewport === 'mobile') return { left: '50%', top: '115%', transform: 'translateX(-50%) translate3d(0,0,0)' };
    if (viewport === 'tablet') return { left: '50%', top: '-100px', transform: 'translateX(-50%) translate3d(0,0,0)' };
    return { left: '-400px', top: '50%', transform: 'translateY(-50%) translate3d(0,0,0)' };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center lg:justify-start overflow-visible select-none">
      <div
        className="absolute w-1 h-1 bg-transparent"
        style={getCenterStyles()}
      >
        {/* SVG Rail - dashed circle */}
        <svg
          className="absolute pointer-events-none overflow-visible"
          width={radius * 2}
          height={radius * 2}
          style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)', zIndex: 0 }}
        >
          {viewport === 'desktop' && (
            <defs>
              <filter id="chalk-effect">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
              </filter>
            </defs>
          )}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth={viewport === 'mobile' ? '1' : '1.5'}
            strokeDasharray={viewport === 'mobile' ? '5 12' : '10 20'}
            filter={viewport === 'desktop' ? 'url(#chalk-effect)' : ''}
            className={viewport === 'mobile' ? 'opacity-[0.03]' : 'opacity-5'}
            style={{ transform: `translate(${radius}px, ${radius}px)` }}
          />
        </svg>

        {/* Pizza items on the rail */}
        {pizzas.map((pizza, index) => {
          const angle = viewport === 'mobile' ? index * -angleStep - 90 : index * angleStep;
          const isActive = index === activeIndex;
          const currentRotation = angle + parentRotation;

          return (
            <div
              key={pizza.id}
              onClick={() => onPizzaClick(index)}
              className="absolute top-0 left-0 cursor-pointer"
              style={{
                transform: `rotate(${currentRotation}deg) translateX(${radius}px) rotate(${-currentRotation}deg) translate(-50%, -50%) translate3d(0,0,0)`,
                transition: `transform ${transitionDuration} ${easing}, opacity ${transitionDuration} ${easing}`,
                zIndex: isActive ? 40 : 10,
                willChange: 'transform',
              }}
            >
              <div style={{
                transform: isActive ? 'scale(1.08)' : 'scale(0.7)',
                opacity: isActive ? 1 : 0.45,
                transition: `transform ${transitionDuration} ${easing}, opacity ${transitionDuration} ${easing}`
              }}>
                <div className="relative" style={{ width: pizzaSize, height: pizzaSize }}>
                  <Image
                    src={assetPath(pizza.image)}
                    alt={pizza.name}
                    fill
                    className="object-contain animate-spin-slow"
                    style={{
                      animationDuration: spinSpeed,
                      filter: isActive
                        ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.1))'
                        : 'drop-shadow(0 3px 6px rgba(0,0,0,0.02))'
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
