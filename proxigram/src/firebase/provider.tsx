
'use client';
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode, firebaseApp: FirebaseApp, firestore: Firestore, auth: Auth }> = ({ children, firebaseApp, firestore, auth }) => {
  const value = useMemo(() => ({ firebaseApp, firestore, auth }), [firebaseApp, firestore, auth]);
  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within a FirebaseProvider.');
  return context;
};

export const useFirestore = () => useFirebase().firestore;
