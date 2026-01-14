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
      <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-2xl">
        <div className="flex items-center gap-2 px-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="profile" className="w-6 h-6 rounded-full" />
          ) : (
            <span>👤</span>
          )}
          <span className="text-[10px] font-bold truncate max-w-[100px]">{user.displayName}</span>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="text-[10px] text-gray-400 hover:text-black font-bold text-left px-2"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
    >
      <span>☁️</span> 클라우드 로그인
    </button>
  );
}
