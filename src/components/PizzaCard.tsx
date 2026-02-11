
"use client";

import React, { useEffect, useState } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, Star } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  visible: boolean;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, visible }) => {
  const [displayPizza, setDisplayPizza] = useState(pizza);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setAnimating(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "glass-card p-12 rounded-[3.5rem] transition-all duration-1000 transform max-w-[500px]",
        visible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0",
        animating ? "scale-95 opacity-50 blur-md" : "scale-100 opacity-100 blur-0"
      )}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Premium Quality</span>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-6xl font-black text-foreground font-headline uppercase tracking-tighter leading-[0.9]">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-black text-4xl mt-2 tracking-tighter">{displayPizza.price}</p>
          </div>
        </div>

        <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium">
          {displayPizza.description}
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <span>Freshness Level</span>
              <span>{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-2 bg-black/5" />
          </div>

          <div className="pt-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Main Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 text-[10px] font-bold uppercase tracking-wider"
                >
                  <Leaf className="w-3 h-3 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button className="w-full h-16 rounded-3xl bg-black hover:bg-primary text-white text-base font-black uppercase tracking-widest group shadow-2xl transition-all active:scale-95 border-none">
            <ShoppingCart className="mr-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
            Order This Slice
          </Button>
        </div>
      </div>
    </div>
  );
};
