"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User, MapPin, Heart, Settings, ChevronLeft,
  Plus, Trash2, Loader2, Check, AlertTriangle,
  Phone, Mail, Cake, Flame, Star, Crown,
  Home, Briefcase, PenLine, ShoppingBag, Zap,
} from "lucide-react";
import { api } from "@/lib/api-client";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNameUpdate?: (name: string) => void;
}

type Tab = "profile" | "addresses" | "favorites" | "settings";

interface ProfileData {
  id: string; phone: string; name: string | null;
  email: string | null; birthDate: string | null;
  allergies: string | null; spicePreference: string | null;
  defaultOrderNote: string | null; loyaltyPoints: number;
  loyaltyTier: string; totalOrders: number; totalSpent: number;
  referralCode: string | null; smsOptIn: boolean;
  preferredPayment: string | null; createdAt: string;
  lastOrderAt: string | null;
  addresses: AddressData[];
  favorites: FavoriteData[];
}

interface AddressData {
  id: string; title: string; province: string; city: string;
  neighborhood: string; street: string; postalCode: string | null;
  isDefault: boolean;
}

interface FavoriteData {
  id: string; title: string; totalAmount?: number;
  items: Array<{
    id: string; quantity: number;
    product: { id: string; name: string; price: number; image: string; isAvailable: boolean };
  }>;
}

const TIER_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  BRONZE: { label: "برنزی", color: "text-amber-700 bg-amber-50 border-amber-200", icon: <Star className="w-3.5 h-3.5" /> },
  SILVER: { label: "نقره‌ای", color: "text-slate-600 bg-slate-50 border-slate-200", icon: <Star className="w-3.5 h-3.5" /> },
  GOLD: { label: "طلایی", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: <Crown className="w-3.5 h-3.5" /> },
  DIAMOND: { label: "الماسی", color: "text-cyan-600 bg-cyan-50 border-cyan-200", icon: <Crown className="w-3.5 h-3.5" /> },
};

const SPICE_OPTIONS = [
  { value: "MILD", label: "ملایم", icon: "🌶️" },
  { value: "MEDIUM", label: "متوسط", icon: "🌶️🌶️" },
  { value: "HOT", label: "تند", icon: "🌶️🌶️🌶️" },
];

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ isOpen, onClose, onNameUpdate }) => {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formBirthDate, setFormBirthDate] = useState("");
  const [formAllergies, setFormAllergies] = useState("");
  const [formSpice, setFormSpice] = useState<string | null>(null);
  const [formOrderNote, setFormOrderNote] = useState("");
  const [formSmsOptIn, setFormSmsOptIn] = useState(true);
  const [formPayment, setFormPayment] = useState<string | null>(null);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrTitle, setAddrTitle] = useState("");
  const [addrNeighborhood, setAddrNeighborhood] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await api.profile.get();
    if (err) { setError(err); setLoading(false); return; }
    if (data) {
      setProfile(data.user as unknown as ProfileData);
      setCompleteness(data.completeness);
      setFormName(data.user.name || "");
      setFormEmail(data.user.email || "");
      setFormBirthDate(data.user.birthDate || "");
      setFormAllergies(data.user.allergies || "");
      setFormSpice(data.user.spicePreference || null);
      setFormOrderNote(data.user.defaultOrderNote || "");
      setFormSmsOptIn(data.user.smsOptIn);
      setFormPayment(data.user.preferredPayment || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
      setTab("profile");
      setSuccess("");
    }
  }, [isOpen, loadProfile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(""); setSuccess("");
    const { error: err } = await api.profile.update({
      name: formName || undefined,
      email: formEmail || "",
      birthDate: formBirthDate || "",
      allergies: formAllergies || "",
      spicePreference: formSpice,
      defaultOrderNote: formOrderNote || "",
      smsOptIn: formSmsOptIn,
      preferredPayment: formPayment,
    });
    setSaving(false);
    if (err) { setError(err); return; }
    setSuccess("پروفایل بروزرسانی شد");
    if (formName && onNameUpdate) onNameUpdate(formName);
    loadProfile();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddAddress = async () => {
    if (!addrTitle || !addrNeighborhood || !addrStreet) {
      setError("عنوان، محله و نشانی الزامی است");
      return;
    }
    setSaving(true); setError("");
    const { error: err } = await api.addresses.create({
      title: addrTitle,
      neighborhood: addrNeighborhood,
      street: addrStreet,
      postalCode: addrPostalCode || "",
      isDefault: addrDefault,
    });
    setSaving(false);
    if (err) { setError(err); return; }
    setShowAddressForm(false);
    setAddrTitle(""); setAddrNeighborhood(""); setAddrStreet("");
    setAddrPostalCode(""); setAddrDefault(false);
    loadProfile();
  };

  const handleDeleteAddress = async (id: string) => {
    const { error: err } = await api.addresses.remove(id);
    if (err) { setError(err); return; }
    loadProfile();
  };

  const handleDeleteFavorite = async (id: string) => {
    const { error: err } = await api.favorites.remove(id);
    if (err) { setError(err); return; }
    loadProfile();
  };

  const handleQuickOrder = async (favorite: FavoriteData) => {
    setSaving(true); setError("");
    // اضافه کردن همه آیتم‌ها به سبد
    for (const item of favorite.items) {
      if (!item.product.isAvailable) continue;
      const { error: err } = await api.cart.add(item.product.id, item.quantity);
      if (err) { setError(err); setSaving(false); return; }
    }
    setSaving(false);
    setSuccess("آیتم‌ها به سبد خرید اضافه شد");
    setTimeout(() => { setSuccess(""); onClose(); }, 1500);
  };

  const tier = TIER_CONFIG[profile?.loyaltyTier || "BRONZE"];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "پروفایل", icon: <User className="w-4 h-4" /> },
    { id: "addresses", label: "آدرس‌ها", icon: <MapPin className="w-4 h-4" /> },
    { id: "favorites", label: "همیشگی", icon: <Heart className="w-4 h-4" /> },
    { id: "settings", label: "تنظیمات", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl font-lalezar p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-black text-center">
            حساب کاربری
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2 bg-black/[0.02]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(""); setSuccess(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                tab === t.id
                  ? "bg-white shadow-md text-primary scale-[1.02]"
                  : "text-muted-foreground hover:bg-white/50"
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-4 bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-xl text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mx-4 bg-green-50 text-green-600 text-xs font-bold px-4 py-2 rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in duration-300">
            <Check className="w-3.5 h-3.5" />
            {success}
          </div>
        )}

        <ScrollArea className="px-5 pb-5 max-h-[55vh]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* ═══ TAB: PROFILE ═══ */}
              {tab === "profile" && profile && (
                <div className="space-y-5">
                  {/* Loyalty Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black p-5 text-white">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                      <div className="absolute top-2 left-4 w-20 h-20 rounded-full bg-primary blur-2xl" />
                      <div className="absolute bottom-2 right-4 w-16 h-16 rounded-full bg-accent blur-2xl" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-white/60 mb-1">پیتزا موشن</p>
                          <p className="text-lg font-black">{profile.name || "کاربر"}</p>
                          <p className="text-xs text-white/50 font-mono mt-1 tracking-wider" dir="ltr">{profile.phone}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 ${tier.color}`}>
                          {tier.icon} {tier.label}
                        </div>
                      </div>
                      <div className="flex gap-6 mt-4 pt-3 border-t border-white/10">
                        <div>
                          <p className="text-[10px] text-white/40">امتیاز</p>
                          <p className="text-sm font-black">{profile.loyaltyPoints.toLocaleString("fa-IR")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40">سفارشات</p>
                          <p className="text-sm font-black">{profile.totalOrders.toLocaleString("fa-IR")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40">مبلغ کل</p>
                          <p className="text-sm font-black">{profile.totalSpent.toLocaleString("fa-IR")} ت</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completeness */}
                  <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="hsl(28,77%,52%)" strokeWidth="3"
                          strokeDasharray={`${completeness}, 100`}
                          className="transition-all duration-1000" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{completeness}%</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold">تکمیل پروفایل</p>
                      <p className="text-[10px] text-muted-foreground">پروفایل کامل‌تر = تجربه بهتر</p>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> نام</Label>
                      <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="h-10 rounded-xl bg-black/[0.03] border-black/5 text-sm" placeholder="نام و نام خانوادگی" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> ایمیل</Label>
                      <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="h-10 rounded-xl bg-black/[0.03] border-black/5 text-sm dir-ltr text-left" placeholder="email@example.com" dir="ltr" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Cake className="w-3 h-3" /> تاریخ تولد (شمسی)</Label>
                      <Input value={formBirthDate} onChange={(e) => setFormBirthDate(e.target.value)} className="h-10 rounded-xl bg-black/[0.03] border-black/5 text-sm" placeholder="15/08 (روز/ماه)" maxLength={5} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> حساسیت غذایی</Label>
                      <Input value={formAllergies} onChange={(e) => setFormAllergies(e.target.value)} className="h-10 rounded-xl bg-black/[0.03] border-black/5 text-sm" placeholder="لاکتوز، گلوتن، ..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3" /> ترجیح تندی</Label>
                      <div className="flex gap-2">
                        {SPICE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFormSpice(formSpice === opt.value ? null : opt.value)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                              formSpice === opt.value
                                ? "bg-primary/10 border-primary/30 text-primary scale-105"
                                : "bg-black/[0.03] border-black/5 hover:bg-black/[0.06]"
                            }`}
                          >
                            {opt.icon} {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><PenLine className="w-3 h-3" /> یادداشت همیشگی</Label>
                      <Input value={formOrderNote} onChange={(e) => setFormOrderNote(e.target.value)} className="h-10 rounded-xl bg-black/[0.03] border-black/5 text-sm" placeholder="مثلا: سس اضافه لطفا" maxLength={300} />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full h-11 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره تغییرات"}
                  </Button>
                </div>
              )}

              {/* ═══ TAB: ADDRESSES ═══ */}
              {tab === "addresses" && profile && (
                <div className="space-y-3">
                  {profile.addresses.length === 0 && !showAddressForm && (
                    <div className="text-center py-8">
                      <MapPin className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">هنوز آدرسی ثبت نشده</p>
                    </div>
                  )}

                  {profile.addresses.map((addr) => (
                    <div key={addr.id} className="relative group p-4 rounded-xl bg-black/[0.02] border border-black/5 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            {addr.title === "خانه" ? <Home className="w-4 h-4 text-primary" /> :
                             addr.title === "محل کار" ? <Briefcase className="w-4 h-4 text-primary" /> :
                             <MapPin className="w-4 h-4 text-primary" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold">{addr.title}</p>
                              {addr.isDefault && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">پیش‌فرض</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{addr.neighborhood}، {addr.street}</p>
                            {addr.postalCode && <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono" dir="ltr">{addr.postalCode}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {showAddressForm ? (
                    <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/[0.02]">
                      <p className="text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> آدرس جدید</p>
                      <Input value={addrTitle} onChange={(e) => setAddrTitle(e.target.value)} className="h-10 rounded-xl bg-white border-black/5 text-sm" placeholder="عنوان (خانه، محل کار، ...)" />
                      <Input value={addrNeighborhood} onChange={(e) => setAddrNeighborhood(e.target.value)} className="h-10 rounded-xl bg-white border-black/5 text-sm" placeholder="محله *" />
                      <Input value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} className="h-10 rounded-xl bg-white border-black/5 text-sm" placeholder="نشانی کامل (خیابان، کوچه، پلاک، طبقه) *" />
                      <Input value={addrPostalCode} onChange={(e) => setAddrPostalCode(e.target.value.replace(/\D/g, ""))} className="h-10 rounded-xl bg-white border-black/5 text-sm" placeholder="کد پستی (اختیاری)" maxLength={10} dir="ltr" />
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)} className="rounded" />
                        آدرس پیش‌فرض
                      </label>
                      <div className="flex gap-2">
                        <Button onClick={handleAddAddress} disabled={saving} className="flex-1 h-10 rounded-xl bg-black hover:bg-primary text-white text-xs font-bold">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره"}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowAddressForm(false)} className="h-10 rounded-xl text-xs">انصراف</Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressForm(true)}
                      className="w-full h-11 rounded-xl border-dashed border-2 border-black/10 hover:border-primary/30 hover:bg-primary/5 text-sm font-bold transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 ml-2" /> افزودن آدرس
                    </Button>
                  )}
                </div>
              )}

              {/* ═══ TAB: FAVORITES (همیشگی) ═══ */}
              {tab === "favorites" && profile && (
                <div className="space-y-3">
                  {profile.favorites.length === 0 && (
                    <div className="text-center py-8">
                      <Heart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">هنوز سفارش همیشگی ندارید</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">از منوی محصولات، سفارش دلخواه خود را ذخیره کنید</p>
                    </div>
                  )}

                  {profile.favorites.map((fav) => (
                    <div key={fav.id} className="group relative p-4 rounded-xl bg-black/[0.02] border border-black/5 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{fav.title}</p>
                            <p className="text-[10px] text-muted-foreground">{fav.items.length} آیتم</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFavorite(fav.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {fav.items.map((item) => (
                          <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-white rounded-lg p-2 border border-black/5">
                            <div className="w-8 h-8 rounded-md bg-black/5 flex items-center justify-center text-[10px]">
                              <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold whitespace-nowrap">{item.product.name}</p>
                              <p className="text-[9px] text-muted-foreground">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {fav.totalAmount && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
                          <p className="text-xs text-muted-foreground">مبلغ کل: <span className="font-bold text-foreground">{fav.totalAmount.toLocaleString("fa-IR")} تومان</span></p>
                          <Button
                            size="sm"
                            onClick={() => handleQuickOrder(fav)}
                            disabled={saving}
                            className="h-8 rounded-lg bg-accent hover:bg-accent/90 text-white text-[10px] font-bold px-4 hover:scale-105 active:scale-95 transition-all duration-200"
                          >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Zap className="w-3 h-3 ml-1" /> سفارش سریع</>}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ═══ TAB: SETTINGS ═══ */}
              {tab === "settings" && profile && (
                <div className="space-y-4">
                  {/* اطلاع‌رسانی */}
                  <div className="p-4 rounded-xl bg-black/[0.02] border border-black/5 space-y-3">
                    <p className="text-sm font-bold">اطلاع‌رسانی</p>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs">دریافت پیامک تبلیغاتی</span>
                      </div>
                      <button
                        onClick={() => setFormSmsOptIn(!formSmsOptIn)}
                        className={`w-10 h-5 rounded-full transition-all duration-300 ${formSmsOptIn ? "bg-primary" : "bg-gray-300"}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${formSmsOptIn ? "mr-0.5 translate-x-0" : "mr-[22px]"}`} />
                      </button>
                    </label>
                  </div>

                  {/* روش پرداخت */}
                  <div className="p-4 rounded-xl bg-black/[0.02] border border-black/5 space-y-3">
                    <p className="text-sm font-bold">روش پرداخت ترجیحی</p>
                    {[
                      { value: "ONLINE", label: "پرداخت آنلاین" },
                      { value: "CASH", label: "نقدی هنگام تحویل" },
                      { value: "CARD_ON_DELIVERY", label: "کارت‌خوان هنگام تحویل" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={formPayment === opt.value}
                          onChange={() => setFormPayment(opt.value)}
                          className="text-primary"
                        />
                        <span className="text-xs">{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* اطلاعات حساب */}
                  <div className="p-4 rounded-xl bg-black/[0.02] border border-black/5 space-y-2">
                    <p className="text-sm font-bold">اطلاعات حساب</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">شماره موبایل</span>
                      <span className="font-mono" dir="ltr">{profile.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">تاریخ عضویت</span>
                      <span>{new Date(profile.createdAt).toLocaleDateString("fa-IR")}</span>
                    </div>
                    {profile.referralCode && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">کد معرف</span>
                        <span className="font-mono font-bold text-primary">{profile.referralCode}</span>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full h-11 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره تنظیمات"}
                  </Button>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
