
"use client";

import React, { useState } from 'react';
import { PIZZAS } from '@/app/lib/pizza-data';
import { PizzaCarousel } from '@/components/PizzaCarousel';
import { PizzaCard } from '@/components/PizzaCard';
import { PizzaThumbnails } from '@/components/PizzaThumbnails';
import { CategoryNavigator } from '@/components/CategoryNavigator';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden font-lalezar text-foreground">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full px-6 md:px-8 py-4 md:py-6 flex items-center justify-between z-50 bg-white/50 backdrop-blur-sm md:bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-primary/20">
            پ
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tighter uppercase italic text-foreground">
            پیتزا<span className="text-primary">موشن</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button className="text-sm font-bold hover:text-primary transition-colors">داستان ما</button>
          <button className="text-sm font-bold hover:text-primary transition-colors">منو</button>
          <button className="text-sm font-bold hover:text-primary transition-colors">شعب</button>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
            <Search className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon" className="rounded-full border-black/5 bg-white shadow-sm w-9 h-9 md:w-10 md:h-10">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-accent text-white rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold">
              ۳
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Hero Content Area */}
      <div className="relative h-screen w-full flex flex-col md:flex-row items-center pt-20 md:pt-0">
        {/* Carousel Section */}
        <div className="w-full h-[40vh] md:w-[60%] md:h-full flex items-center z-10 overflow-visible">
          <PizzaCarousel 
            pizzas={PIZZAS} 
            activeIndex={activeIndex} 
            onPizzaClick={setActiveIndex} 
          />
        </div>

        {/* Info Card Section */}
        <div className="w-full h-[60vh] md:w-[40%] flex justify-center items-start md:items-center px-6 md:pr-16 z-20 overflow-y-auto pb-32 md:pb-0">
          <PizzaCard 
            pizza={PIZZAS[activeIndex]} 
            visible={true}
          />
        </div>
      </div>

      {/* Bottom Controls Container */}
      <div className="fixed bottom-0 md:bottom-10 left-0 md:left-10 w-full md:w-auto z-40 flex flex-col items-start gap-4 bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-4 md:p-0 border-t border-black/5 md:border-none">
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
          <PizzaThumbnails 
            pizzas={PIZZAS} 
            activeIndex={activeIndex} 
            onSelect={setActiveIndex} 
          />
        </div>
        <div className="ml-2 hidden md:block">
          <CategoryNavigator activeId="pizzas" />
        </div>
      </div>

      {/* Vertical Navigation Dot Indicator - Desktop Only */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-40">
        {PIZZAS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1.5 transition-all duration-500 rounded-full ${
              i === activeIndex ? 'h-12 bg-primary' : 'h-3 bg-black/10 hover:bg-black/20'
            }`}
          />
        ))}
      </div>
    </main>
  );
}
