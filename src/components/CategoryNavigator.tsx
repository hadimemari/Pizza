"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Pizza, ChefHat, Salad, CupSoda } from 'lucide-react';

interface CategoryNavigatorProps {
  categories: Array<{ id: string; label: string; icon: string }>;
  activeId: string;
  onCategoryChange: (id: string) => void;
  vertical?: boolean;
}

const IconMap: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-3.5 h-3.5" />,
  ChefHat: <ChefHat className="w-3.5 h-3.5" />,
  Salad: <Salad className="w-3.5 h-3.5" />,
  CupSoda: <CupSoda className="w-3.5 h-3.5" />
};

const IconMapVertical: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-4 h-4" />,
  ChefHat: <ChefHat className="w-4 h-4" />,
  Salad: <Salad className="w-4 h-4" />,
  CupSoda: <CupSoda className="w-4 h-4" />
};

export const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({ categories, activeId, onCategoryChange, vertical = false }) => {
  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-black/[0.06] shadow-lg">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 gap-0.5",
              activeId === cat.id
                ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                : "text-muted-foreground/70 hover:bg-black/5 active:scale-95"
            )}
          >
            {IconMapVertical[cat.icon]}
            <span className="text-[6px] font-black leading-none tracking-wide">{cat.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-sm border border-transparent">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
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
