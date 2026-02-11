
"use client";

import React from 'react';
import { CATEGORIES } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Pizza, ChefHat, Salad, CupSoda } from 'lucide-react';

interface CategoryNavigatorProps {
  activeId: string;
}

const IconMap: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-5 h-5" />,
  ChefHat: <ChefHat className="w-5 h-5" />,
  Salad: <Salad className="w-5 h-5" />,
  CupSoda: <CupSoda className="w-5 h-5" />
};

export const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({ activeId }) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-card flex items-center gap-2 p-2 rounded-2xl border-white/50 shadow-2xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 font-bold text-sm",
              activeId === cat.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "hover:bg-black/5 text-muted-foreground"
            )}
          >
            {IconMap[cat.icon]}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
