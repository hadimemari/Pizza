
"use client";

import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Animated Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-float-bg" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] animate-float-bg" style={{ animationDelay: '-4s' }} />
      
      <div className="relative flex flex-col items-center gap-12 z-10">
        {/* Animated Logo Container */}
        <div className="flex flex-col items-center gap-6 animate-logo-pulse">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl md:text-6xl shadow-[0_20px_50px_rgba(230,126,34,0.3)] relative z-20 overflow-hidden">
              پ
              {/* Shine effect inside logo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ animationName: 'shimmer', animationDuration: '2s', animationIterationCount: 'infinite' }} />
            </div>
            {/* Outer ring animation */}
            <div className="absolute inset-[-10px] border-2 border-primary/20 rounded-[3rem] animate-ping opacity-20" />
          </div>

          <div className="flex flex-col items-center">
            <h1 className="font-black text-4xl md:text-5xl tracking-tighter uppercase italic text-foreground flex items-center gap-1">
              پیتزا<span className="text-primary">موشن</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-8 h-[1px] bg-black/10" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">
                Premium Experience
              </span>
              <span className="w-8 h-[1px] bg-black/10" />
            </div>
          </div>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-64 h-[3px] bg-black/5 rounded-full overflow-hidden relative">
            <div className="absolute top-0 h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 animate-loader-line" />
          </div>
          <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest animate-pulse">
            Loading Cinematic Assets...
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
