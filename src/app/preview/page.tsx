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
  
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (file: File, type: 'profile' | 'post' | 'highlight') => {
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
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
        <input 
          value={profile.username}
          onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
          className="font-black text-lg bg-transparent outline-none w-2/3 tracking-tighter"
        />
        <div className="flex gap-4 font-black text-xl">
          <span>⊕</span>
          <span>☰</span>
        </div>
      </header>

      {/* Profile Info */}
      <section className="p-4 flex gap-10 items-center">
        <label className="relative cursor-pointer group shrink-0">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'profile')} />
          <div className="w-24 h-24 rounded-full border-2 border-black p-[3px] overflow-hidden bg-white">
             <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile.profilePic ? (
                  <img src={profile.profilePic} className="w-full h-full object-cover" alt="profile" />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
             </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-[#FF5C00] text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-lg font-black">+</div>
        </label>
        
        <div className="flex-1 flex justify-around text-center">
          <div><div className="font-black text-lg leading-tight">{posts.length}</div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posts</div></div>
          <div><div className="font-black text-lg leading-tight">12.5k</div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Followers</div></div>
          <div><div className="font-black text-lg leading-tight">850</div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Following</div></div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-5 pb-6">
        <input 
          value={profile.name}
          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
          className="block font-black text-sm bg-transparent outline-none w-full mb-0.5"
          placeholder="Display Name"
        />
        <textarea 
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          className="block text-xs font-bold text-gray-800 bg-transparent outline-none w-full resize-none leading-relaxed"
          rows={3}
          placeholder="Bio..."
        />
      </section>

      {/* Action Buttons */}
      <section className="px-4 flex gap-1.5 mb-8">
        <button className="flex-1 bg-gray-100 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Edit Profile</button>
        <button className="flex-1 bg-gray-100 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Share Profile</button>
      </section>

      {/* Highlights */}
      <section className="px-4 pb-10 flex gap-5 overflow-x-auto no-scrollbar">
        {highlights.map((h) => (
          <div key={h.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-16 rounded-full border border-gray-200 p-0.5 bg-white">
              <img src={h.image} className="w-full h-full rounded-full object-cover" />
            </div>
            <input 
              value={h.title}
              onChange={(e) => {
                const newH = highlights.map(item => item.id === h.id ? { ...item, title: e.target.value } : item);
                setHighlights(newH);
              }}
              className="text-[10px] font-bold text-center w-16 bg-transparent outline-none truncate"
            />
          </div>
        ))}
        <label className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'highlight')} />
          <div className="w-16 h-16 rounded-full border-2 border-black border-dashed flex items-center justify-center text-2xl font-light hover:bg-gray-50">+</div>
          <span className="text-[10px] font-bold uppercase tracking-widest">New</span>
        </label>
      </section>

      {/* NEW 2025 Tab Design */}
      <div className="flex border-t border-gray-100">
        <div className="flex-1 py-3 flex justify-center border-b-2 border-black">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
        </div>
        <div className="flex-1 py-3 flex justify-center opacity-20">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <div className="flex-1 py-3 flex justify-center opacity-20">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </div>

      {/* NEW 2025 Vertical Grid (4:5 Ratio) */}
      <div className="grid grid-cols-3 gap-[1.5px] bg-white">
        {/* Upload Post Button */}
        <label className="aspect-[4/5] bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors border-r border-b border-gray-100">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'post')} />
          <span className="text-3xl font-light text-[#FF5C00]">+</span>
          <span className="text-[8px] font-black uppercase tracking-widest">New Post</span>
        </label>
        
        {posts.map((post) => (
          <div key={post.id} className="aspect-[4/5] relative group overflow-hidden border-r border-b border-gray-100">
            <img src={post.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
               <button 
                onClick={() => setPosts(prev => prev.filter(p => p.id !== post.id))}
                className="bg-white text-black text-[10px] font-black px-3 py-1.5 uppercase tracking-widest hover:bg-[#FF5C00] hover:text-white"
               >
                 Delete
               </button>
            </div>
            {/* Reels Icon Overlay (Simulated) */}
            <div className="absolute top-2 right-2 text-white/80 opacity-60">
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-12 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-200">2025 Vertical Grid Layout</p>
      </div>
    </div>
  );
}
