
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api-client';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

type Step = "phone" | "otp" | "name";

export const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === "otp" && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setCode('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: err } = await api.auth.sendOtp(phone);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    setIsNewUser(data?.isNewUser || false);
    setStep("otp");
    setCountdown(120);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isNewUser && !name) {
      setStep("name");
      setLoading(false);
      return;
    }

    const { data, error: err } = await api.auth.verifyOtp(phone, code, name || undefined);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    if (data?.user) {
      onLoginSuccess(data.user.name || "کاربر");
      onClose();
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: err } = await api.auth.verifyOtp(phone, code, name);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    if (data?.user) {
      onLoginSuccess(data.user.name || name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl font-lalezar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-foreground uppercase tracking-tighter">
            خوش آمدید به <span className="text-primary">پیتزا موشن</span>
          </DialogTitle>
          <DialogDescription className="text-center font-medium text-muted-foreground">
            {step === "phone" && "شماره موبایل خود را وارد کنید."}
            {step === "otp" && `کد تایید ارسال شده به ${phone} را وارد کنید.`}
            {step === "name" && "لطفا نام خود را وارد کنید."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Step 1: Phone */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">شماره موبایل</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="09123456789"
                  className="pr-10 h-12 rounded-xl border-black/5 bg-black/5 focus-visible:ring-primary text-left dir-ltr"
                  required
                  type="tel"
                  pattern="09[0-9]{9}"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ارسال کد تایید"}
            </Button>
          </form>
        )}

        {/* Step 2: OTP Code */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">کد تایید ۶ رقمی</Label>
              <div className="relative">
                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={codeInputRef}
                  placeholder="------"
                  className="pr-10 h-14 rounded-xl border-black/5 bg-black/5 focus-visible:ring-primary text-center text-2xl tracking-[0.5em] font-mono"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  dir="ltr"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  تغییر شماره
                </button>
                {countdown > 0 ? (
                  <span>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp as any}
                    className="text-primary font-bold hover:underline"
                  >
                    ارسال مجدد
                  </button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={loading || code.length < 6} className="w-full h-12 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تایید کد"}
            </Button>
          </form>
        )}

        {/* Step 3: Name (new users) */}
        {step === "name" && (
          <form onSubmit={handleNameSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">نام شما</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="نام و نام خانوادگی"
                  className="pr-10 h-12 rounded-xl border-black/5 bg-black/5 focus-visible:ring-primary"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ورود به پیتزاموشن"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
