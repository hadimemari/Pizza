
"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { PizzaCarousel } from '@/components/PizzaCarousel';
import { PizzaCard } from '@/components/PizzaCard';
import { PizzaThumbnails } from '@/components/PizzaThumbnails';
import { CategoryNavigator } from '@/components/CategoryNavigator';
import { AuthDialog } from '@/components/AuthDialog';
import { CartSheet } from '@/components/CartSheet';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { api } from '@/lib/api-client';
import { mapProduct, mapCategory, type MappedProduct, type MappedCategory } from '@/lib/data-mapper';

// Memoized Category Section
const CategorySection = memo(({
  cat,
  items,
  isActive,
  activeIndex,
  onPizzaClick,
  onOrder
}: {
  cat: MappedCategory;
  items: MappedProduct[];
  isActive: boolean;
  activeIndex: number;
  onPizzaClick: (i: number) => void;
  onOrder: () => void;
}) => {
  return (
    <div
      className="relative h-screen w-full flex flex-col lg:flex-row items-center lg:justify-center pt-14 sm:pt-20 lg:pt-12 pb-16 sm:pb-24 lg:pb-0"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-[15%] left-[5%] w-[40%] h-[40%] bg-primary/[0.03] rounded-full blur-[150px] animate-float-bg" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-accent/[0.03] rounded-full blur-[150px] animate-float-bg" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="w-full h-[28vh] sm:h-[45vh] lg:w-[55%] lg:h-full flex items-center z-10 overflow-visible relative lg:pl-12">
        <PizzaCarousel
          pizzas={items}
          activeIndex={activeIndex}
          onPizzaClick={onPizzaClick}
        />
      </div>

      <div className="w-full flex-1 lg:w-[45%] flex justify-center items-stretch sm:items-center px-4 sm:px-6 lg:pr-24 z-20 overflow-hidden sm:overflow-visible">
        {isActive && items[activeIndex] && (
          <PizzaCard
            pizza={items[activeIndex]}
            visible={true}
            onOrder={onOrder}
          />
        )}
      </div>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export default function Home() {
  // Data from API
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [categories, setCategories] = useState<MappedCategory[]>([]);

  // UI state
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      const [productsRes, categoriesRes, meRes] = await Promise.all([
        api.products.list(),
        api.categories.list(),
        api.auth.me(),
      ]);

      if (productsRes.data?.products) {
        setProducts(productsRes.data.products.map(mapProduct));
      }

      if (categoriesRes.data?.categories) {
        const mapped = categoriesRes.data.categories.map(mapCategory);
        setCategories(mapped);
        if (mapped.length > 0) {
          setActiveCategoryId(mapped[0].id);
          const indices: Record<string, number> = {};
          mapped.forEach((c) => { indices[c.id] = 0; });
          setActiveIndices(indices);
        }
      }

      if (meRes.data?.user) {
        setUserName(meRes.data.user.name);
        // Load cart count
        const cartRes = await api.cart.get();
        if (cartRes.data?.items) {
          setCartCount(cartRes.data.items.reduce((s, i) => s + i.quantity, 0));
        }
      }

      // Loading screen delay
      setTimeout(() => setIsLoading(false), 2000);
    };

    loadData();
  }, []);

  const handleOrder = useCallback(async () => {
    if (!userName) {
      setIsAuthOpen(true);
      return;
    }

    // Get current active product
    const currentItems = products.filter(p => p.category === activeCategoryId);
    const activeIdx = activeIndices[activeCategoryId] || 0;
    const product = currentItems[activeIdx];

    if (product) {
      const { error } = await api.cart.add(product.id);
      if (!error) {
        setCartCount(prev => prev + 1);
      }
    }
  }, [userName, products, activeCategoryId, activeIndices]);

  const handleLoginSuccess = useCallback(async (name: string) => {
    setUserName(name);
    const cartRes = await api.cart.get();
    if (cartRes.data?.items) {
      setCartCount(cartRes.data.items.reduce((s, i) => s + i.quantity, 0));
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await api.auth.logout();
    setUserName(null);
    setCartCount(0);
  }, []);

  const currentCategoryItems = useMemo(() => {
    return products.filter(item => item.category === activeCategoryId);
  }, [products, activeCategoryId]);

  const activeIndex = activeIndices[activeCategoryId] || 0;

  const handleIndexChange = (index: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [activeCategoryId]: index
    }));
  };

  const categoryIndex = categories.findIndex(cat => cat.id === activeCategoryId);

  return (
    <main className="relative h-screen w-full bg-white overflow-hidden font-lalezar text-foreground select-none">
      {isLoading && <LoadingScreen />}

      <div className={`h-full w-full transition-all duration-[1500ms] cubic-bezier(0.23, 1, 0.32, 1) ${isLoading ? 'opacity-0 scale-105 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}>
        <header className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 md:py-6 flex items-center justify-between z-50 bg-white/40 backdrop-blur-xl border-b border-black/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-[1rem] flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl shadow-primary/20">
              پ
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic text-foreground leading-none">
                پیتزا<span className="text-primary">موشن</span>
              </span>
              <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:block">Premium Dining</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {userName ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 bg-black/5 px-5 py-2 rounded-full border border-black/5">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-black">{userName}</span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-black/5 rounded-full transition-colors" title="خروج">
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                variant="ghost"
                className="rounded-full text-sm font-black hover:bg-black/5 px-6"
              >
                ورود / ثبت‌نام
              </Button>
            )}

            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-black/5 bg-white shadow-xl w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform"
                onClick={() => userName ? setIsCartOpen(true) : setIsAuthOpen(true)}
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-accent text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-black animate-in zoom-in duration-300 shadow-lg shadow-accent/30">
                  {cartCount}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Cinematic Vertical Scroller */}
        <div
          className="relative w-full transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) will-change-transform gpu-accelerated"
          style={{ transform: `translate3d(0, -${categoryIndex * 100}vh, 0)` }}
        >
          {categories.map((cat) => (
            <CategorySection
              key={cat.id}
              cat={cat}
              items={products.filter(p => p.category === cat.id)}
              isActive={activeCategoryId === cat.id}
              activeIndex={activeIndices[cat.id] || 0}
              onPizzaClick={(i) => {
                setActiveIndices(prev => ({ ...prev, [cat.id]: i }));
              }}
              onOrder={handleOrder}
            />
          ))}
        </div>

        {/* Mobile: Vertical Category Nav - Right Side */}
        <div className="fixed right-2.5 top-1/2 -translate-y-1/2 z-50 lg:hidden">
          <CategoryNavigator
            categories={categories}
            activeId={activeCategoryId}
            onCategoryChange={(id) => setActiveCategoryId(id)}
            vertical={true}
          />
        </div>

        {/* Mobile: Slim Bottom Thumbnails */}
        <div className="fixed bottom-0 left-0 w-full z-40 lg:hidden">
          <div className="bg-white border-t border-black/[0.06] px-3 py-2.5 overflow-x-auto no-scrollbar shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            <PizzaThumbnails
              pizzas={currentCategoryItems}
              activeIndex={activeIndex}
              onSelect={handleIndexChange}
            />
          </div>
        </div>

        {/* Desktop: Bottom-left Nav (Thumbnails + Categories) */}
        <div className="fixed bottom-12 left-12 z-40 hidden lg:flex flex-col items-start gap-5">
          <div className="overflow-x-auto no-scrollbar">
            <PizzaThumbnails
              pizzas={currentCategoryItems}
              activeIndex={activeIndex}
              onSelect={handleIndexChange}
            />
          </div>
          <div className="ml-3">
            <CategoryNavigator
              categories={categories}
              activeId={activeCategoryId}
              onCategoryChange={(id) => setActiveCategoryId(id)}
            />
          </div>
        </div>

        {/* Desktop: Vertical Pagination Indicator */}
        <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`w-2 transition-all duration-1000 rounded-full ${
                activeCategoryId === cat.id ? 'h-16 bg-primary shadow-lg shadow-primary/30' : 'h-4 bg-black/10 hover:bg-black/30'
              }`}
            />
          ))}
        </div>
      </div>

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCartUpdate={setCartCount}
      />
    </main>
  );
}
