"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Review } from '@/app/lib/pizza-data';
import { Star, MessageCircle, User } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pizzaName: string;
  reviews: Review[];
}

export const ReviewsDialog: React.FC<ReviewsDialogProps> = ({ isOpen, onClose, pizzaName, reviews }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl bg-white/95 backdrop-blur-2xl font-lalezar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-foreground flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-primary" />
            نظرات برای <span className="text-primary">{pizzaName}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-4 pr-4 ml-[-1rem]">
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 rounded-2xl bg-black/5 border border-black/5 space-y-3 transition-all hover:bg-white hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{review.userName}</span>
                        <span className="text-[10px] text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-black/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                <p>هنوز نظری ثبت نشده است.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
