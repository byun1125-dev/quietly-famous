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
      <div className="flex items-center gap-3 px-3 py-2 border border-black bg-white">
        {user.photoURL ? (
          <img src={user.photoURL} alt="profile" className="w-6 h-6" />
        ) : (
          <div className="w-6 h-6 border border-black bg-[#F5F5F2] flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xs font-medium leading-tight">{user.displayName}</span>
          <button 
            onClick={() => signOut(auth)}
            className="text-[10px] opacity-40 hover:opacity-100 text-left transition-opacity"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="px-4 py-2 border border-black bg-white text-xs hover:bg-black hover:text-white transition-colors"
    >
      클라우드 로그인
    </button>
  );
}
