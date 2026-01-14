"use client";

import { useState, useRef } from "react";
import { useSyncData } from "@/hooks/useSyncData";
import { auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

type Highlight = { id: string; title: string; image: string };
type Post = { id: string; image: string };
type Profile = {
  name: string;
  username: string;
  bio: string;
  profilePic: string;
};

export default function PreviewPage() {
  const [profile, setProfile] = useSyncData<Profile>("ig_profile", {
    name: "Quietly Famous",
    username: "quietly_famous_official",
    bio: "조용하지만 확실한 존재감 🌑",
    profilePic: ""
  });
  const [highlights, setHighlights] = useSyncData<Highlight[]>("ig_highlights", []);
  const [posts, setPosts] = useSyncData<Post[]>("ig_posts", []);
  
  const [uploading, setUploading] = useState<string | null>(null); // 'profile' | 'post' | 'highlight'
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, type: 'profile' | 'post' | 'highlight', extraId?: string) => {
    if (!auth.currentUser) return;
    setUploading(type);
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/preview/${type}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      if (type === 'profile') {
        setProfile(prev => ({ ...prev, profilePic: url }));
      } else if (type === 'post') {
        setPosts(prev => [{ id: Math.random().toString(36).substring(7), image: url }, ...prev]);
      } else if (type === 'highlight') {
        setHighlights(prev => [...prev, { id: Math.random().toString(36).substring(7), title: "Highlight", image: url }]);
      }
    } catch (e) {
      console.error(e);
      alert("업로드 실패");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto bg-white min-h-screen shadow-2xl border-x-2 border-black font-sans text-black">
      {/* Header */}
      <header className="px-4 py-3 border-b-2 border-black flex items-center justify-between sticky top-0 bg-white z-10">
        <input 
          value={profile.username}
          onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
          className="font-black text-lg bg-transparent outline-none w-2/3 tracking-tighter"
        />
        <div className="flex gap-4 font-black">
          <span>+</span>
          <span>☰</span>
        </div>
      </header>

      {/* Profile Info */}
      <section className="p-4 flex gap-8 items-center">
        <label className="relative cursor-pointer group shrink-0">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'profile')} />
          <div className="w-20 h-20 rounded-full border-2 border-black overflow-hidden bg-gray-100 flex items-center justify-center">
            {profile.profilePic ? (
              <img src={profile.profilePic} className="w-full h-full object-cover" alt="profile" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white font-bold">CHANGE</span>
          </div>
        </label>
        
        <div className="flex-1 flex justify-around text-center">
          <div><div className="font-black text-sm">{posts.length}</div><div className="text-[10px] font-bold text-gray-400">Posts</div></div>
          <div><div className="font-black text-sm">1.2k</div><div className="text-[10px] font-bold text-gray-400">Followers</div></div>
          <div><div className="font-black text-sm">850</div><div className="text-[10px] font-bold text-gray-400">Following</div></div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-4 pb-4 space-y-1">
        <input 
          value={profile.name}
          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
          className="block font-black text-sm bg-transparent outline-none w-full"
          placeholder="Display Name"
        />
        <textarea 
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          className="block text-xs font-bold text-gray-600 bg-transparent outline-none w-full resize-none"
          rows={2}
          placeholder="Bio..."
        />
      </section>

      {/* Highlights */}
      <section className="px-4 pb-6 flex gap-4 overflow-x-auto no-scrollbar">
        {highlights.map((h) => (
          <div key={h.id} className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-black p-0.5">
              <img src={h.image} className="w-full h-full rounded-full object-cover" />
            </div>
            <input 
              value={h.title}
              onChange={(e) => {
                const newH = highlights.map(item => item.id === h.id ? { ...item, title: e.target.value } : item);
                setHighlights(newH);
              }}
              className="text-[10px] font-bold text-center w-14 bg-transparent outline-none uppercase"
            />
          </div>
        ))}
        <label className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'highlight')} />
          <div className="w-14 h-14 rounded-full border-2 border-black border-dashed flex items-center justify-center text-xl">+</div>
          <span className="text-[10px] font-bold uppercase">New</span>
        </label>
      </section>

      {/* Action Buttons */}
      <section className="px-4 flex gap-2 mb-6">
        <button className="flex-1 border-2 border-black py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">Edit Profile</button>
        <button className="flex-1 border-2 border-black py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">Share Profile</button>
      </section>

      {/* Grid Header */}
      <div className="flex border-t-2 border-black">
        <div className="flex-1 py-3 text-center font-black border-b-2 border-black">▦</div>
        <div className="flex-1 py-3 text-center font-black opacity-20 italic underline">REELS</div>
      </div>

      {/* Grid - Post Upload Section */}
      <div className="grid grid-cols-3 gap-[2px] bg-black border-t-[1px] border-black">
        <label className="aspect-square bg-gray-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-100">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'post')} />
          <span className="text-2xl font-light">+</span>
          <span className="text-[8px] font-black uppercase">Add 4:5</span>
        </label>
        
        {posts.map((post) => (
          <div key={post.id} className="aspect-square bg-gray-200 relative group overflow-hidden">
            {/* 4:5 감성을 보여주기 위해 그리드에서는 센터 크롭, 클릭 시 4:5 레이아웃 고려 가능 */}
            <img src={post.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <button 
                onClick={() => setPosts(prev => prev.filter(p => p.id !== post.id))}
                className="text-white text-[10px] font-black underline"
               >
                 DELETE
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4:5 Post Vibe Preview (Floating or Bottom Section) */}
      <div className="p-10 bg-gray-50 mt-10 border-t-2 border-black border-dashed text-center">
         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#FF5C00]">4:5 Aspect Ratio Guide</h4>
         <div className="max-w-[200px] mx-auto aspect-[4/5] bg-white border-2 border-black p-2 flex items-center justify-center overflow-hidden">
            <p className="text-[8px] font-bold text-gray-300">업로드 시 이 비율로 포스트가 채워집니다.</p>
         </div>
      </div>
    </div>
  );
}
