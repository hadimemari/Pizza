
"use client";

import React from 'react';
import { CATEGORIES } from '@/app/lib/pizza-data';
import { cn } from '@/lib/utils';
import { Pizza, ChefHat, Salad, CupSoda } from 'lucide-react';

interface CategoryNavigatorProps {
  activeId: string;
}

const IconMap: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-4 h-4" />,
  ChefHat: <ChefHat className="w-4 h-4" />,
  Salad: <Salad className="w-4 h-4" />,
  CupSoda: <CupSoda className="w-4 h-4" />
};

export const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({ activeId }) => {
  return (
    <div className="mt-2">
      <div className="bg-white/10 backdrop-blur-md flex items-center gap-1 p-1.5 rounded-full border border-white/10 shadow-xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold text-xs",
              activeId === cat.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "hover:bg-white/10 text-muted-foreground/80 hover:text-foreground"
            )}
          >
            {IconMap[cat.icon]}
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
