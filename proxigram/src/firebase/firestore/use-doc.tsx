
'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference, DocumentSnapshot } from 'firebase/firestore';

export function useDoc<T = any>(ref: DocumentReference | null | undefined) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setIsLoading(false);
      return;
    }
    const unsub = onSnapshot(ref, (snap: DocumentSnapshot) => {
      setData(snap.exists() ? { ...snap.data(), id: snap.id } as any : null);
      setIsLoading(false);
    });
    return unsub;
  }, [ref]);

  return { data, isLoading };
}
