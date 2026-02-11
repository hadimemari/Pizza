
"use client";

import React, { useState } from 'react';
import { PIZZAS } from '@/app/lib/pizza-data';
import { PizzaCarousel } from '@/components/PizzaCarousel';
import { PizzaCard } from '@/components/PizzaCard';
import { PizzaThumbnails } from '@/components/PizzaThumbnails';
import { CategoryNavigator } from '@/components/CategoryNavigator';
import { ParallaxText } from '@/components/ParallaxText';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="relative h-screen w-full bg-slate-50 overflow-hidden font-body text-foreground">
      {/* Background Decorative Text */}
      <ParallaxText text={PIZZAS[activeIndex].name} activeIndex={activeIndex} />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full px-12 py-8 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
            P
          </div>
          <span className="font-headline font-black text-2xl tracking-tighter uppercase italic text-foreground">
            Pizza<span className="text-primary">Motion</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Our Story</a>
          <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Menu</a>
          <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Locations</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon" className="rounded-full border-black/10 bg-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </Button>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
              3
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-full w-full flex items-center justify-between">
        {/* Left: Huge Wheel (Partially off-screen) */}
        <div className="w-[60%] h-full flex items-center relative select-none">
          <PizzaCarousel 
            pizzas={PIZZAS} 
            activeIndex={activeIndex} 
            onPizzaClick={setActiveIndex} 
          />
        </div>

        {/* Right: Info Section */}
        <div className="w-[40%] flex justify-center items-center pr-10 z-30">
          <PizzaCard 
            pizza={PIZZAS[activeIndex]} 
            visible={true}
          />
        </div>
      </div>

      {/* Bottom Navigation Area */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center pb-6">
        <PizzaThumbnails 
          pizzas={PIZZAS} 
          activeIndex={activeIndex} 
          onSelect={setActiveIndex} 
        />
        <CategoryNavigator activeId="pizzas" />
      </div>

      {/* Navigation Indicators on the side */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <div className="text-[10px] font-black vertical-text opacity-20 mb-4 tracking-widest uppercase">
          Explore Flavors
        </div>
        {PIZZAS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1 transition-all duration-300 rounded-full ${
              i === activeIndex ? 'h-10 bg-primary' : 'h-3 bg-black/10 hover:bg-black/30'
            }`}
          />
        ))}
      </div>
    </main>
  );
}
