
'use client';
import React, { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const sdks = useMemo(() => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app)
    };
  }, []);

  return (
    <FirebaseProvider firebaseApp={sdks.firebaseApp} auth={sdks.auth} firestore={sdks.firestore}>
      {children}
    </FirebaseProvider>
  );
}
