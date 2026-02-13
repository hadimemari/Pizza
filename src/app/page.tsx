
"use client";

import React, { useState, useEffect, useMemo, memo } from 'react';
import { PIZZAS, CATEGORIES } from '@/app/lib/pizza-data';
import { PizzaCarousel } from '@/components/PizzaCarousel';
import { PizzaCard } from '@/components/PizzaCard';
import { PizzaThumbnails } from '@/components/PizzaThumbnails';
import { CategoryNavigator } from '@/components/CategoryNavigator';
import { AuthDialog } from '@/components/AuthDialog';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User } from 'lucide-react';

// Memoized Category Section for Hybrid Performance
const CategorySection = memo(({ 
  cat, 
  isActive, 
  activeIndex, 
  onPizzaClick, 
  onOrder 
}: { 
  cat: any, 
  isActive: boolean, 
  activeIndex: number, 
  onPizzaClick: (i: number) => void,
  onOrder: () => void
}) => {
  const items = useMemo(() => PIZZAS.filter(item => item.category === cat.id), [cat.id]);
  
  return (
    <div 
      className="relative h-screen w-full flex flex-col lg:flex-row items-center justify-center pt-24 lg:pt-0"
      style={{ contentVisibility: 'auto' }}
    >
      {/* Background Decorative Element for Desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px] animate-float-bg" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[120px] animate-float-bg" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="w-full h-[40vh] sm:h-[45vh] lg:w-[60%] lg:h-full flex items-center z-10 overflow-visible relative">
        <PizzaCarousel 
          pizzas={items} 
          activeIndex={activeIndex} 
          onPizzaClick={onPizzaClick} 
        />
      </div>

      <div className="w-full flex-1 lg:w-[40%] flex justify-center items-center px-4 sm:px-6 lg:pr-24 z-20">
        {isActive && (
          <PizzaCard 
            pizza={items[activeIndex] || items[0]} 
            visible={true}
            onOrder={onOrder}
          />
        )}
      </div>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState("pizzas");
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({
    pizzas: 0,
    calzones: 0,
    sides: 0,
    beverages: 0
  });
  const [cartCount, setCartCount] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cinematic delay for splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleOrder = () => {
    setCartCount(prev => prev + 1);
    if (!user) {
      setTimeout(() => {
        setIsAuthOpen(true);
      }, 500);
    }
  };

  const currentCategoryItems = useMemo(() => {
    return PIZZAS.filter(item => item.category === activeCategoryId);
  }, [activeCategoryId]);

  const activeIndex = activeIndices[activeCategoryId] || 0;

  const handleIndexChange = (index: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [activeCategoryId]: index
    }));
  };

  const categoryIndex = CATEGORIES.findIndex(cat => cat.id === activeCategoryId);

  return (
    <main className="relative h-screen w-full bg-white overflow-hidden font-lalezar text-foreground select-none">
      {isLoading && <LoadingScreen />}

      <div className={`h-full w-full transition-all duration-[1500ms] cubic-bezier(0.23, 1, 0.32, 1) ${isLoading ? 'opacity-0 scale-105 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}>
        <header className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 md:py-8 flex items-center justify-between z-50 bg-white/40 backdrop-blur-xl border-b border-black/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-[1rem] flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl shadow-primary/20">
              پ
            </div>
            <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic text-foreground">
              پیتزا<span className="text-primary">موشن</span>
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {user ? (
              <div className="flex items-center gap-3 bg-black/5 px-6 py-2.5 rounded-full border border-black/5">
                <User className="w-5 h-5 text-primary" />
                <span className="text-sm font-black">{user}</span>
              </div>
            ) : (
              <Button 
                onClick={() => setIsAuthOpen(true)}
                variant="ghost" 
                className="rounded-full text-sm font-black hover:bg-black/5 px-6"
              >
                ورود / ثبت‌نام
              </Button>
            )}
            
            <div className="relative">
              <Button variant="outline" size="icon" className="rounded-full border-black/5 bg-white shadow-xl w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-accent text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-black animate-in zoom-in duration-300 shadow-lg shadow-accent/30">
                  {cartCount}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Cinematic Vertical Scroller */}
        <div 
          className="relative w-full transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) will-change-transform gpu-accelerated"
          style={{ transform: `translate3d(0, -${categoryIndex * 100}vh, 0)` }}
        >
          {CATEGORIES.map((cat) => (
            <CategorySection 
              key={cat.id}
              cat={cat}
              isActive={activeCategoryId === cat.id}
              activeIndex={activeIndices[cat.id] || 0}
              onPizzaClick={(i) => {
                setActiveIndices(prev => ({ ...prev, [cat.id]: i }));
              }}
              onOrder={handleOrder}
            />
          ))}
        </div>

        {/* Global Nav Elements */}
        <div className="fixed bottom-0 lg:bottom-12 left-0 lg:left-12 w-full lg:w-auto z-40 flex flex-col items-center lg:items-start gap-5 bg-white/95 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none p-5 lg:p-0 border-t border-black/5 lg:border-none shadow-2xl lg:shadow-none">
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
            <PizzaThumbnails 
              pizzas={currentCategoryItems} 
              activeIndex={activeIndex} 
              onSelect={handleIndexChange} 
            />
          </div>
          <div className="lg:ml-3">
            <CategoryNavigator 
              activeId={activeCategoryId} 
              onCategoryChange={(id) => setActiveCategoryId(id)}
            />
          </div>
        </div>

        {/* Vertical Pagination Indicator (Desktop Only) */}
        <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-40">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`w-2 transition-all duration-1000 rounded-full ${
                activeCategoryId === cat.id ? 'h-16 bg-primary shadow-lg shadow-primary/30' : 'h-4 bg-black/10 hover:bg-black/30'
              }`}
            />
          ))}
        </div>
      </div>

      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(name) => setUser(name)}
      />
    </main>
  );
}
