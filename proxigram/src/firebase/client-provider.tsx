
'use client';
import React, { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const sdks = useMemo(() => initializeFirebase(), []);
  return (
    <FirebaseProvider firebaseApp={sdks.firebaseApp} auth={sdks.auth} firestore={sdks.firestore}>
      {children}
    </FirebaseProvider>
  );
}
