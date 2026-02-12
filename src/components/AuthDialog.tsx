
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, User, ArrowLeft } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // در اینجا منطق واقعی احراز هویت قرار می‌گیرد
    onLoginSuccess(name || 'کاربر عزیز');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl font-lalezar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-foreground uppercase tracking-tighter">
            خوش آمدید به <span className="text-primary">پیتزا موشن</span>
          </DialogTitle>
          <DialogDescription className="text-center font-medium text-muted-foreground">
            برای ادامه فرآیند سفارش، وارد حساب خود شوید.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-black/5 rounded-xl p-1">
            <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">ورود</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">ثبت‌نام</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone-login" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">شماره موبایل</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone-login" 
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹" 
                    className="pr-10 h-12 rounded-xl border-black/5 bg-black/5 focus-visible:ring-primary"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
                تایید و ورود
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">نام و نام خانوادگی</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="نام شما" 
                    className="pr-10 h-12 rounded-xl border-black/5 bg-black/5 focus-visible:ring-primary"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-reg" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">شماره موبایل</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone-reg" 
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹" 
                    className="pr-10 h-12 rounded-xl border-black/5 bg-black/5 focus-visible:ring-primary"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-black hover:bg-primary text-white font-bold transition-all duration-500">
                ایجاد حساب کاربری
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
