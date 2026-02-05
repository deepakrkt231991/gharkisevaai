'use client';
import React, { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function WorkerSignup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">Worker Signup</h1>
        <p>Registration Page</p>
      </div>
    </Suspense>
  );
}