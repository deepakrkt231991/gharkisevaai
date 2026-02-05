'use client';
import React, { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function PropertyDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">Property Details</h1>
        <p>Coming Soon...</p>
      </div>
    </Suspense>
  );
}