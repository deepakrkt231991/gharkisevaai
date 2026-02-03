'use client'
import React, { Suspense } from 'react';

function ExploreContent() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Explore Services</h1>
      <p>Ghar Ki Sevaai - Services coming soon!</p>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}