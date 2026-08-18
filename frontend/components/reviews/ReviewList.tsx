"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { SellerReview } from '../../types';
import { Avatar } from '../ui/Avatar';

export const ReviewList: React.FC<{ reviews: SellerReview[] }> = ({ reviews }) => (
  <div className="flex flex-col divide-y divide-[var(--wn-line)]">
    {reviews.map((review, i) => (
      <div key={i} className="py-6 flex gap-4">
        <Avatar name={review.name} className="!text-[var(--wn-ink-2)]" />
        <div>
          <div className="flex items-center gap-2 mb-1">
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
          <p className="text-[14.5px] text-[var(--wn-ink-2)] leading-relaxed">{review.text}</p>
        </div>
      </div>
    ))}
  </div>
);