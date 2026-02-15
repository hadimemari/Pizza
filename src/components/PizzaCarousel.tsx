
"use client";

import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
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
  const touchRef = useRef<{ startX: number; startY: number; startTime: number; moved: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // ─── Touch/Swipe gesture for mobile ───
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (viewport !== 'mobile') return;
    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      moved: false,
    };
  }, [viewport]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current || viewport !== 'mobile') return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchRef.current.startX);
    const dy = Math.abs(touch.clientY - touchRef.current.startY);
    if (dx > 10 || dy > 10) {
      touchRef.current.moved = true;
    }
  }, [viewport]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current || viewport !== 'mobile') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;
    const dt = Date.now() - touchRef.current.startTime;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Require minimum movement and detect dominant axis
    const threshold = 30;
    const total = pizzas.length;
    if (total === 0) return;

    if (touchRef.current.moved && (absDx > threshold || absDy > threshold) && dt < 500) {
      // Determine swipe direction → carousel rotates upward
      // Swipe left or swipe up → next item (clockwise)
      // Swipe right or swipe down → previous item (counter-clockwise)
      let nextIndex: number;
      if (absDx > absDy) {
        // Horizontal swipe: left = next, right = prev
        nextIndex = dx < 0
          ? (activeIndex + 1) % total
          : (activeIndex - 1 + total) % total;
      } else {
        // Vertical swipe: up = next, down = prev
        nextIndex = dy < 0
          ? (activeIndex + 1) % total
          : (activeIndex - 1 + total) % total;
      }
      onPizzaClick(nextIndex);
    }

    touchRef.current = null;
  }, [viewport, pizzas.length, activeIndex, onPizzaClick]);

  // ─── Adaptive parameters per viewport ───
  const radius = viewport === 'mobile' ? 280 : viewport === 'tablet' ? 550 : 850;
  const pizzaSize = viewport === 'mobile' ? 150 : viewport === 'tablet' ? 350 : 520;
  const spinSpeed = viewport === 'mobile' ? '120s' : '80s';

  const total = pizzas.length;
  const angleStep = total > 0 ? 360 / total : 0;
  const transitionDuration = viewport === 'mobile' ? '700ms' : '1000ms';
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // Clockwise rotation for all viewports
  const parentRotation = activeIndex * -angleStep;

  const getCenterStyles = (): React.CSSProperties => {
    // Mobile: center ABOVE container → active item at bottom, others rotate upward & hide
    if (viewport === 'mobile') return { left: '50%', top: '-30%', transform: 'translateX(-50%) translate3d(0,0,0)' };
    if (viewport === 'tablet') return { left: '50%', top: '-100px', transform: 'translateX(-50%) translate3d(0,0,0)' };
    return { left: '-400px', top: '50%', transform: 'translateY(-50%) translate3d(0,0,0)' };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center lg:justify-start overflow-visible select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
            className={viewport === 'mobile' ? 'opacity-[0.02]' : 'opacity-5'}
            style={{ transform: `translate(${radius}px, ${radius}px)` }}
          />
        </svg>

        {/* Pizza items on the rail */}
        {pizzas.map((pizza, index) => {
          // Mobile: +90 puts active at bottom of circle; others rotate upward
          // Desktop: 0 base, items arranged around circle
          const angle = viewport === 'mobile' ? index * angleStep + 90 : index * angleStep;
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
                transform: isActive ? 'scale(1.1)' : 'scale(0.55)',
                opacity: isActive ? 1 : 0.2,
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
