"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인에 실패했습니다. Firebase 설정을 확인해주세요.");
    }
  };

  if (user) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-white border border-[var(--border)] rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span>👤</span>
            </div>
          )}
          <span className="text-xs font-medium truncate max-w-[100px]">{user.displayName}</span>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="text-xs text-gray-500 hover:text-gray-700 font-medium text-left transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#8A9A8A] text-white rounded-lg text-xs font-semibold hover:bg-[#7a8a7a] transition-colors"
    >
      <span>☁️</span> 클라우드 로그인
    </button>
  );
}
