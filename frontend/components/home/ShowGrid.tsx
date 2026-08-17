"use client"

import React from 'react';
import { HomeShow } from '../../types';
import { ShowCard } from '../cards/ShowCard';

export const ShowGrid: React.FC<{ shows: HomeShow[] }> = ({ shows }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
    {shows.map(show => <ShowCard key={`${show.seller}-${show.title}`} show={show} />)}
  </div>
);