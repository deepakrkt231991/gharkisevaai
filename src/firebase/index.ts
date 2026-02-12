'use client';

// NOTE: initializeFirebase() has been moved to src/firebase/init.ts
// to allow its use in Server Components/Actions.
// Client components that need it (like providers) should import it from there.

export * from './provider';
export { useStorage } from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
