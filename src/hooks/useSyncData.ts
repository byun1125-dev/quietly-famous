"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export function useSyncData<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Auth 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // 로그인 안됨: 로컬스토리지에서 로드
        const localData = localStorage.getItem(key);
        if (localData) setData(JSON.parse(localData));
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [key]);

  // 2. Firebase 실시간 동기화
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    // 유저별 전용 문서 경로: users/{uid}/data/{key}
    const docRef = doc(db, "users", user.uid, "appData", key);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as T);
      } else {
        // 클라우드에 데이터가 없으면 로컬 데이터 업로드
        const localData = localStorage.getItem(key);
        if (localData) {
          const parsed = JSON.parse(localData);
          setDoc(docRef, parsed);
          setData(parsed);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, key]);

  // 3. 데이터 업데이트 함수
  const updateData = async (newData: T | ((prev: T) => T)) => {
    const valueToStore = newData instanceof Function ? newData(data) : newData;
    
    setData(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));

    if (user) {
      const docRef = doc(db, "users", user.uid, "appData", key);
      await setDoc(docRef, valueToStore as any);
    }
  };

  return [data, updateData, loading] as const;
}
