"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Loader2,
  CheckCircle,
  ChevronRight,
  MapPin,
  Shield,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api-client';

// ── Types ──

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    isAvailable: boolean;
  };
}

interface Address {
  id: string;
  title: string;
  province: string;
  city: string;
  neighborhood: string;
  street: string;
  postalCode: string | null;
  isDefault: boolean;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate: (count: number) => void;
}

type CheckoutStep = 1 | 2 | 3 | 4 | 5;
type PaymentMethod = 'online' | 'cash' | 'card_on_delivery';
type SlideDirection = 'forward' | 'backward';

// ── Component ──

export const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose, onCartUpdate }) => {
  // Cart state
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Checkout flow state
  const [step, setStep] = useState<CheckoutStep>(1);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('forward');
  const [isAnimating, setIsAnimating] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');

  // Mock gateway state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [dynamicPass, setDynamicPass] = useState('');
  const [gatewayProcessing, setGatewayProcessing] = useState(false);

  // Order result state
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: number;
    refId: string;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    totalAmount: number;
  } | null>(null);

  // Ordering state
  const [ordering, setOrdering] = useState(false);

  // Ref for step container
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Helpers ──

  const formatPrice = (price: number) => price.toLocaleString("fa-IR") + " تومان";

  const tax = Math.round(subtotal * 0.09);
  const deliveryFee = 25000;
  const totalAmount = subtotal + tax + deliveryFee;

  // ── Navigation ──

  const goToStep = (nextStep: CheckoutStep, direction: SlideDirection = 'forward') => {
    setSlideDirection(direction);
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  // ── Data Loading ──

  const loadCart = useCallback(async () => {
    setLoading(true);
    const { data } = await api.cart.get();
    if (data) {
      setItems(data.items);
      setSubtotal(data.total);
      onCartUpdate(data.items.reduce((s: number, i: CartItem) => s + i.quantity, 0));
    }
    setLoading(false);
  }, [onCartUpdate]);

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true);
    const { data } = await api.addresses.list();
    if (data) {
      setAddresses(data.addresses);
      const defaultAddr = data.addresses.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (data.addresses.length > 0) {
        setSelectedAddressId(data.addresses[0].id);
      }
    }
    setAddressesLoading(false);
  }, []);

  // ── Effects ──

  useEffect(() => {
    if (isOpen) {
      loadCart();
      setStep(1);
      setOrderSuccess(null);
      setIsAnimating(false);
      setPaymentMethod('online');
      setCardNumber('');
      setExpiryMonth('');
      setExpiryYear('');
      setCvv('');
      setDynamicPass('');
      setGatewayProcessing(false);
      setSelectedAddressId(null);
    }
  }, [isOpen, loadCart]);

  // ── Cart Actions ──

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await api.cart.update(itemId, quantity);
    await loadCart();
  };

  const handleClearCart = async () => {
    await api.cart.clear();
    setItems([]);
    setSubtotal(0);
    onCartUpdate(0);
  };

  // ── Checkout Flow ──

  const handleGoToAddress = () => {
    loadAddresses();
    goToStep(2, 'forward');
  };

  const handleGoToSummary = () => {
    goToStep(3, 'forward');
  };

  const handleProceedToPayment = async () => {
    if (paymentMethod === 'online') {
      goToStep(4, 'forward');
    } else {
      // Cash or card on delivery: create order and go to success
      await handleCreateOrder();
    }
  };

  const handleCreateOrder = async () => {
    setOrdering(true);

    const { data: orderData, error: orderErr } = await api.orders.create(
      undefined,
      selectedAddressId || undefined
    );

    if (orderErr || !orderData) {
      setOrdering(false);
      return;
    }

    const { data: payData } = await api.payment.request(orderData.order.id);

    setOrdering(false);
    setOrderSuccess({
      orderNumber: orderData.order.orderNumber,
      refId: payData?.payment?.refId || '',
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
    });
    setItems([]);
    setSubtotal(0);
    onCartUpdate(0);
    goToStep(5, 'forward');
  };

  const handleGatewayPay = async () => {
    setGatewayProcessing(true);
    // Simulate 2 second processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGatewayProcessing(false);
    await handleCreateOrder();
  };

  const handleGatewayCancel = () => {
    goToStep(3, 'backward');
  };

  // ── Card number formatting ──

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // ── Slide animation classes ──

  const getSlideClasses = () => {
    if (isAnimating) {
      return 'opacity-0 translate-x-0';
    }
    return 'opacity-100 translate-x-0';
  };

  // ── Step title ──

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'سبد خرید';
      case 2: return 'انتخاب آدرس';
      case 3: return 'خلاصه سفارش';
      case 4: return 'درگاه پرداخت';
      case 5: return 'نتیجه سفارش';
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <ShoppingBag className="w-5 h-5 text-primary" />;
      case 2: return <MapPin className="w-5 h-5 text-primary" />;
      case 3: return <CreditCard className="w-5 h-5 text-primary" />;
      case 4: return <Shield className="w-5 h-5 text-emerald-600" />;
      case 5: return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  // ── Progress bar ──

  const renderProgressBar = () => {
    if (step === 5) return null;
    const progress = ((step) / 4) * 100;
    return (
      <div className="px-6 pb-2">
        <div className="flex justify-between text-[10px] text-zinc-400 mb-1.5 font-bold">
          <span className={step >= 1 ? 'text-primary' : ''}>سبد خرید</span>
          <span className={step >= 2 ? 'text-primary' : ''}>آدرس</span>
          <span className={step >= 3 ? 'text-primary' : ''}>خلاصه</span>
          <span className={step >= 4 ? 'text-primary' : ''}>پرداخت</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════
  // STEP 1: Cart Items
  // ══════════════════════════════════════════

  const renderCartStep = () => (
    <div className={`transition-all duration-300 ease-out ${getSlideClasses()}`}>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-300 px-6">
          <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-base font-black">سبد خرید خالی است</p>
          <p className="text-xs text-zinc-400 mt-1">محصولی به سبد اضافه کنید</p>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-[40vh] px-6">
            <div className="space-y-3 pb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-black/[0.02] rounded-2xl border border-black/[0.03] hover:border-primary/10 transition-colors"
                >
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate">{item.product.name}</p>
                    <p className="text-xs text-primary font-bold">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1 || 0)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-3 h-3" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                    </button>
                    <span className="w-6 text-center text-sm font-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 pt-3 border-t border-black/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">جمع کل:</span>
              <span className="text-lg font-black text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Button
              onClick={handleGoToAddress}
              className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-primary text-white font-black text-base transition-all flex items-center justify-center gap-2"
            >
              <span>ادامه فرآیند خرید</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Button>

            <button
              onClick={handleClearCart}
              className="w-full text-center text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              خالی کردن سبد
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ══════════════════════════════════════════
  // STEP 2: Address Selection
  // ══════════════════════════════════════════

  const renderAddressStep = () => (
    <div className={`transition-all duration-300 ease-out ${getSlideClasses()}`}>
      {addressesLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <MapPin className="w-12 h-12 mb-3 text-zinc-200" />
          <p className="text-base font-black text-zinc-400">ابتدا آدرس ثبت کنید</p>
          <p className="text-xs text-zinc-400 mt-1 mb-4">
            برای ارسال سفارش نیاز به آدرس دارید
          </p>
          <button
            onClick={() => goToStep(1, 'backward')}
            className="text-sm text-primary font-bold hover:underline flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به سبد خرید
          </button>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-[45vh] px-6">
            <div className="space-y-3 pb-4">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedAddressId === addr.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-black/[0.05] bg-black/[0.01] hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedAddressId === addr.id
                          ? 'bg-primary text-white'
                          : 'bg-black/5 text-zinc-400'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-zinc-900">{addr.title}</p>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 leading-5">
                        {addr.province}، {addr.city}، {addr.neighborhood}، {addr.street}
                      </p>
                      {addr.postalCode && (
                        <p className="text-[10px] text-zinc-400 mt-1">
                          کد پستی: {addr.postalCode}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-primary'
                          : 'border-zinc-300'
                      }`}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 pt-3 border-t border-black/5 space-y-3">
            <Button
              onClick={handleGoToSummary}
              disabled={!selectedAddressId}
              className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-primary text-white font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>ادامه</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Button>

            <button
              onClick={() => goToStep(1, 'backward')}
              className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowRight className="w-3 h-3" />
              بازگشت به سبد خرید
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ══════════════════════════════════════════
  // STEP 3: Order Summary + Payment Method
  // ══════════════════════════════════════════

  const renderSummaryStep = () => (
    <div className={`transition-all duration-300 ease-out ${getSlideClasses()}`}>
      <ScrollArea className="max-h-[50vh] px-6">
        <div className="space-y-5 pb-4">
          {/* Fee Breakdown */}
          <div className="bg-black/[0.02] rounded-2xl border border-black/[0.04] p-4 space-y-3">
            <h4 className="text-sm font-black text-zinc-700 mb-3">جزئیات هزینه</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">هزینه غذاها:</span>
              <span className="text-sm font-bold text-zinc-700">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">مالیات (۹٪):</span>
              <span className="text-sm font-bold text-zinc-700">
                {formatPrice(tax)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">هزینه ارسال:</span>
              <span className="text-sm font-bold text-zinc-700">
                {formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="border-t border-dashed border-black/10 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-zinc-800">مبلغ قابل پرداخت:</span>
                <span className="text-lg font-black text-primary">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-black/[0.02] rounded-2xl border border-black/[0.04] p-4">
            <h4 className="text-sm font-black text-zinc-700 mb-3">روش پرداخت</h4>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
              className="space-y-2"
              dir="rtl"
            >
              <label
                htmlFor="pay-online"
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-black/[0.02]'
                }`}
              >
                <RadioGroupItem value="online" id="pay-online" />
                <Smartphone className="w-5 h-5 text-zinc-500" />
                <Label htmlFor="pay-online" className="text-sm font-bold cursor-pointer flex-1">
                  پرداخت آنلاین
                </Label>
              </label>

              <label
                htmlFor="pay-cash"
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-black/[0.02]'
                }`}
              >
                <RadioGroupItem value="cash" id="pay-cash" />
                <Banknote className="w-5 h-5 text-zinc-500" />
                <Label htmlFor="pay-cash" className="text-sm font-bold cursor-pointer flex-1">
                  نقدی
                </Label>
              </label>

              <label
                htmlFor="pay-card"
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card_on_delivery'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-black/[0.02]'
                }`}
              >
                <RadioGroupItem value="card_on_delivery" id="pay-card" />
                <CreditCard className="w-5 h-5 text-zinc-500" />
                <Label htmlFor="pay-card" className="text-sm font-bold cursor-pointer flex-1">
                  کارتخوان
                </Label>
              </label>
            </RadioGroup>
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 pt-3 border-t border-black/5 space-y-3">
        <Button
          onClick={handleProceedToPayment}
          disabled={ordering}
          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base transition-all flex items-center justify-center gap-2"
        >
          {ordering ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>پرداخت</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </>
          )}
        </Button>

        <button
          onClick={() => goToStep(2, 'backward')}
          className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors flex items-center justify-center gap-1"
        >
          <ArrowRight className="w-3 h-3" />
          بازگشت به انتخاب آدرس
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════
  // STEP 4: Mock Payment Gateway
  // ══════════════════════════════════════════

  const renderGatewayStep = () => (
    <div className={`transition-all duration-300 ease-out ${getSlideClasses()}`}>
      <ScrollArea className="max-h-[55vh] px-6">
        <div className="space-y-4 pb-4">
          {/* Bank Header */}
          <div className="bg-gradient-to-l from-blue-700 to-blue-900 rounded-2xl p-4 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6" />
              <h3 className="text-base font-black">درگاه پرداخت امن</h3>
            </div>
            <p className="text-blue-200 text-[11px]">
              اطلاعات شما به صورت رمزنگاری شده ارسال می‌شود
            </p>
          </div>

          {/* Amount */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p className="text-xs text-emerald-600 mb-1">مبلغ قابل پرداخت</p>
            <p className="text-xl font-black text-emerald-700">
              {formatPrice(totalAmount)}
            </p>
          </div>

          {/* Card Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-600 block">شماره کارت</label>
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="---- ---- ---- ----"
              className="h-12 text-center text-lg tracking-[0.3em] font-mono rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white placeholder:tracking-[0.5em] placeholder:text-zinc-300"
              dir="ltr"
              maxLength={19}
            />
          </div>

          {/* Expiry + CVV Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 block">ماه</label>
              <Input
                type="text"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                placeholder="MM"
                className="h-11 text-center font-mono rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white placeholder:text-zinc-300"
                dir="ltr"
                maxLength={2}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 block">سال</label>
              <Input
                type="text"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                placeholder="YY"
                className="h-11 text-center font-mono rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white placeholder:text-zinc-300"
                dir="ltr"
                maxLength={2}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 block">CVV2</label>
              <Input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="***"
                className="h-11 text-center font-mono rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white placeholder:text-zinc-300"
                dir="ltr"
                maxLength={4}
              />
            </div>
          </div>

          {/* Dynamic Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-600 block">رمز پویا</label>
            <Input
              type="password"
              value={dynamicPass}
              onChange={(e) => setDynamicPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="رمز پویا را وارد کنید"
              className="h-12 text-center text-lg font-mono rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white placeholder:text-zinc-300 placeholder:text-sm placeholder:font-lalezar"
              dir="ltr"
              maxLength={6}
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 pt-3 border-t border-black/5 space-y-3">
        {gatewayProcessing ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
            </div>
            <p className="text-sm font-bold text-zinc-500 animate-pulse">
              در حال پردازش پرداخت...
            </p>
          </div>
        ) : (
          <>
            <Button
              onClick={handleGatewayPay}
              disabled={
                cardNumber.replace(/\s/g, '').length < 16 ||
                !expiryMonth ||
                !expiryYear ||
                cvv.length < 3 ||
                dynamicPass.length < 4
              }
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              پرداخت
            </Button>

            <button
              onClick={handleGatewayCancel}
              className="w-full h-10 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 font-bold text-sm transition-all"
            >
              انصراف
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════
  // STEP 5: Success
  // ══════════════════════════════════════════

  const renderSuccessStep = () => (
    <div className={`transition-all duration-300 ease-out ${getSlideClasses()}`}>
      <div className="p-6 flex flex-col items-center gap-4">
        {/* Animated Checkmark */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[bounceIn_0.6s_ease-out]">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-200/50 animate-ping" />
        </div>

        <h3 className="text-xl font-black text-zinc-900 mt-2">
          سفارش با موفقیت ثبت شد
        </h3>

        {orderSuccess && (
          <>
            <div className="text-center space-y-2 text-sm">
              <p className="text-zinc-500">
                شماره سفارش:{' '}
                <span className="font-black text-zinc-900">
                  {orderSuccess.orderNumber}
                </span>
              </p>
              {orderSuccess.refId && (
                <p className="text-zinc-500">
                  کد پیگیری:{' '}
                  <span className="font-black text-primary">
                    {orderSuccess.refId}
                  </span>
                </p>
              )}
            </div>

            {/* Fee recap */}
            <div className="w-full bg-black/[0.02] rounded-2xl border border-black/[0.04] p-4 space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">هزینه غذاها:</span>
                <span className="text-xs font-bold text-zinc-600">
                  {formatPrice(orderSuccess.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">مالیات (۹٪):</span>
                <span className="text-xs font-bold text-zinc-600">
                  {formatPrice(orderSuccess.tax)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">هزینه ارسال:</span>
                <span className="text-xs font-bold text-zinc-600">
                  {formatPrice(orderSuccess.deliveryFee)}
                </span>
              </div>
              <div className="border-t border-dashed border-black/10 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-zinc-700">مبلغ پرداخت شده:</span>
                  <span className="text-sm font-black text-primary">
                    {formatPrice(orderSuccess.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <Button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-primary text-white font-black text-base transition-all mt-2"
        >
          بازگشت به منو
        </Button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════
  // Render
  // ══════════════════════════════════════════

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderCartStep();
      case 2: return renderAddressStep();
      case 3: return renderSummaryStep();
      case 4: return renderGatewayStep();
      case 5: return renderSuccessStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] max-h-[85vh] rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl font-lalezar p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-xl font-black text-center text-foreground uppercase tracking-tighter flex items-center justify-center gap-2">
            {getStepIcon()}
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        {renderProgressBar()}

        <div ref={containerRef} className="overflow-hidden">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
