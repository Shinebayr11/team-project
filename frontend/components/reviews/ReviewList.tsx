"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { SellerReview } from '../../types';
import { Avatar } from '../ui/Avatar';

export const ReviewList: React.FC<{ reviews: SellerReview[] }> = ({ reviews }) => (
  <div className="flex flex-col divide-y divide-[var(--wn-line)]">
    {reviews.map((review, i) => (
      <div key={i} className="py-6 flex gap-4">
        <div className="shrink-0">
          <Avatar name={review.name} className="!text-[var(--wn-ink-2)]" />
        </div>
        <div className="min-w-0 flex-1">
          {/* Нэр + од + огноо 320px дээр нэг мөрөнд багтахгүй. */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-[700] text-[15px] text-[var(--wn-ink)]">{review.name}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className={`w-3 h-3 ${j < review.rating ? 'fill-[var(--wn-accent)] text-[var(--wn-accent)]' : 'fill-[var(--wn-line)] text-[var(--wn-line)]'}`}
                />
              ))}
            </div>
            <span className="text-[13px] text-[var(--wn-ink-4)] ml-1">{review.date}</span>
          </div>
          <p className="text-[14.5px] text-[var(--wn-ink-2)] leading-relaxed break-words">{review.text}</p>
        </div>
      </div>
    ))}
  </div>
);