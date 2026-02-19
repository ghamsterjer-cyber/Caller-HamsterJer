
'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot } from 'firebase/firestore';

export function useCollection<T = any>(query: (Query<DocumentData> & {__memo?: boolean}) | null | undefined) {
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    const unsub = onSnapshot(query, (snap: QuerySnapshot) => {
      setData(snap.docs.map(d => ({ ...d.data(), id: d.id } as T & { id: string })));
      setIsLoading(false);
    });
    return unsub;
  }, [query]);

  return { data, isLoading };
}
