
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { PIZZAS, CATEGORIES } from '@/app/lib/pizza-data';
import { PizzaCarousel } from '@/components/PizzaCarousel';
import { PizzaCard } from '@/components/PizzaCard';
import { PizzaThumbnails } from '@/components/PizzaThumbnails';
import { CategoryNavigator } from '@/components/CategoryNavigator';
import { AuthDialog } from '@/components/AuthDialog';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, User } from 'lucide-react';

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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
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

  const handleLoginSuccess = (userName: string) => {
    setUser(userName);
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
    <main className="relative min-h-screen w-full bg-white overflow-hidden font-lalezar text-foreground select-none">
      {/* Loading Screen Overlay */}
      {isLoading && <LoadingScreen />}

      {/* Main Content with Transition */}
      <div className={`transition-all duration-1000 ease-in-out ${isLoading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        {/* Header */}
        <header className="fixed top-0 left-0 w-full px-6 md:px-8 py-4 md:py-6 flex items-center justify-between z-50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-primary/20">
              پ
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tighter uppercase italic text-foreground">
              پیتزا<span className="text-primary">موشن</span>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full border border-black/5">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">{user}</span>
              </div>
            ) : (
              <Button 
                onClick={() => setIsAuthOpen(true)}
                variant="ghost" 
                className="rounded-full text-xs font-bold hover:bg-black/5"
              >
                ورود / ثبت‌نام
              </Button>
            )}
            
            <div className="relative">
              <Button variant="outline" size="icon" className="rounded-full border-black/5 bg-white shadow-sm w-9 h-9 md:w-10 md:h-10">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-accent text-white rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold animate-in zoom-in duration-300">
                  {cartCount}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Cinematic Vertical World Container - 150vh spacing for cinematic distance */}
        <div 
          className="relative w-full transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ transform: `translateY(-${categoryIndex * 150}vh)` }}
        >
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              className="relative h-[150vh] w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start"
            >
              {/* Vertical Center Alignment for the items in the current screen viewport */}
              <div className="h-screen w-full flex flex-col lg:flex-row items-center justify-center">
                <div className="w-full h-[45vh] md:h-[50vh] lg:w-[60%] lg:h-full flex items-center z-10 overflow-visible relative">
                  <PizzaCarousel 
                    pizzas={PIZZAS.filter(item => item.category === cat.id)} 
                    activeIndex={activeIndices[cat.id] || 0} 
                    onPizzaClick={(i) => {
                      setActiveIndices(prev => ({ ...prev, [cat.id]: i }));
                    }} 
                  />
                </div>

                <div className="w-full flex-1 lg:w-[40%] flex justify-center items-center px-6 lg:pr-16 z-20">
                  {activeCategoryId === cat.id && (
                    <PizzaCard 
                      pizza={PIZZAS.filter(item => item.category === cat.id)[activeIndices[cat.id] || 0]} 
                      visible={true}
                      onOrder={handleOrder}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Bottom Controls */}
        <div className="fixed bottom-0 lg:bottom-10 left-0 lg:left-10 w-full lg:w-auto z-40 flex flex-col items-center lg:items-start gap-3 bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0 border-t border-black/5 lg:border-none">
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
            <PizzaThumbnails 
              pizzas={currentCategoryItems} 
              activeIndex={activeIndex} 
              onSelect={handleIndexChange} 
            />
          </div>
          <div className="lg:ml-2">
            <CategoryNavigator 
              activeId={activeCategoryId} 
              onCategoryChange={(id) => setActiveCategoryId(id)}
            />
          </div>
        </div>

        {/* Vertical Navigation Dot Indicator - Desktop Only */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-40">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`w-1.5 transition-all duration-1000 rounded-full ${
                activeCategoryId === cat.id ? 'h-12 bg-primary' : 'h-3 bg-black/10 hover:bg-black/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </main>
  );
}
