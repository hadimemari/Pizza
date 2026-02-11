
"use client";

import React from 'react';
import { CATEGORIES } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Pizza, ChefHat, Salad, CupSoda } from 'lucide-react';

interface CategoryNavigatorProps {
  activeId: string;
}

const IconMap: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-3.5 h-3.5" />,
  ChefHat: <ChefHat className="w-3.5 h-3.5" />,
  Salad: <Salad className="w-3.5 h-3.5" />,
  CupSoda: <CupSoda className="w-3.5 h-3.5" />
};

export const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({ activeId }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-sm border border-transparent">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 font-bold text-[10px] uppercase tracking-wider",
            activeId === cat.id 
              ? "bg-white/20 text-foreground shadow-sm" 
              : "text-muted-foreground/60 hover:text-foreground hover:bg-white/10"
          )}
        >
          {IconMap[cat.icon]}
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};
