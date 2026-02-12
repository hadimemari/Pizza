"use client";

import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="flex flex-col items-center gap-4 animate-logo-pulse">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-3xl flex items-center justify-center text-white font-black text-4xl md:text-5xl shadow-2xl shadow-primary/30">
            پ
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-3xl md:text-4xl tracking-tighter uppercase italic text-foreground">
              پیتزا<span className="text-primary">موشن</span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2">
              Premium Pizza Experience
            </span>
          </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-48 h-[2px] bg-black/5 rounded-full overflow-hidden relative">
          <div className="absolute top-0 h-full bg-primary animate-loader-line" />
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
};