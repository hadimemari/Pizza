
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
    <main className="relative h-screen w-full bg-white overflow-hidden font-lalezar text-foreground">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full px-8 py-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
            پ
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic text-foreground">
            پیتزا<span className="text-primary">موشن</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button className="text-sm font-bold hover:text-primary transition-colors">داستان ما</button>
          <button className="text-sm font-bold hover:text-primary transition-colors">منو</button>
          <button className="text-sm font-bold hover:text-primary transition-colors">شعب</button>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon" className="rounded-full border-black/5 bg-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </Button>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">
              ۳
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Hero Content Area */}
      <div className="relative h-full w-full flex items-center">
        {/* Left Section: Pizza Carousel */}
        <div className="w-[60%] h-full flex items-center z-10">
          <PizzaCarousel 
            pizzas={PIZZAS} 
            activeIndex={activeIndex} 
            onPizzaClick={setActiveIndex} 
          />
        </div>

        {/* Right Section: Info Card */}
        <div className="w-[40%] flex justify-center items-center pr-16 z-20">
          <PizzaCard 
            pizza={PIZZAS[activeIndex]} 
            visible={true}
          />
        </div>
      </div>

      {/* Bottom Controls Container */}
      <div className="fixed bottom-10 left-10 z-40 flex flex-col items-start gap-4">
        <PizzaThumbnails 
          pizzas={PIZZAS} 
          activeIndex={activeIndex} 
          onSelect={setActiveIndex} 
        />
        <div className="ml-2">
          <CategoryNavigator activeId="pizzas" />
        </div>
      </div>

      {/* Vertical Navigation Dot Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-40">
        {PIZZAS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1.5 transition-all duration-[5000ms] rounded-full ${
              i === activeIndex ? 'h-12 bg-primary' : 'h-3 bg-black/10 hover:bg-black/20'
            }`}
          />
        ))}
      </div>
    </main>
  );
}
