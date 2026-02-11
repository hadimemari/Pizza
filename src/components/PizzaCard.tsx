
"use client";

import React, { useEffect, useState } from 'react';
import { Pizza } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Flame, Leaf, Utensils, ShoppingCart } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  visible: boolean;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, visible }) => {
  const [displayPizza, setDisplayPizza] = useState(pizza);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0);
    const timeout = setTimeout(() => {
      setDisplayPizza(pizza);
      setOpacity(1);
    }, 200);
    return () => clearTimeout(timeout);
  }, [pizza]);

  return (
    <div 
      className={cn(
        "glass-card p-8 rounded-[2rem] transition-all duration-300 transform w-[420px]",
        visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      )}
      style={{ opacity }}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground font-headline uppercase tracking-tighter">
              {displayPizza.name}
            </h2>
            <p className="text-primary font-bold text-2xl">{displayPizza.price}</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
            {displayPizza.category}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {displayPizza.description}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Cheesiness Rating</span>
              <span>{displayPizza.cheesiness}%</span>
            </div>
            <Progress value={displayPizza.cheesiness} className="h-2" />
          </div>

          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {displayPizza.ingredients.map((ing) => (
                <div 
                  key={ing} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 border border-black/5 text-xs font-medium"
                >
                  <Leaf className="w-3 h-3 text-green-600" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-bold group shadow-xl shadow-primary/20 transition-all active:scale-95">
            <ShoppingCart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Add to Order
          </Button>
        </div>
      </div>
    </div>
  );
};
