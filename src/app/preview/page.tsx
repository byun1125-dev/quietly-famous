"use client";

import { useState, useRef } from "react";
import { useSyncData } from "@/hooks/useSyncData";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    <div className="max-w-[400px] mx-auto bg-white min-h-screen shadow-lg font-sans text-black">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
        <input 
          value={profile.username}
          onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
          className="font-semibold text-base bg-transparent outline-none w-2/3"
        />
        <div className="flex gap-5 text-2xl">
          <span>+</span>
          <span>☰</span>
        </div>
      </header>

      {/* Profile Info */}
      <section className="p-4 flex gap-5 items-center">
        <label className="relative cursor-pointer group shrink-0">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'profile')} />
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
             <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profile.profilePic ? (
                    <img src={profile.profilePic} className="w-full h-full object-cover" alt="profile" />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
             </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-sm font-bold">+</div>
        </label>
        
        <div className="flex-1 flex justify-around text-center">
          <div><div className="font-semibold text-base">{posts.length}</div><div className="text-xs text-gray-500">게시물</div></div>
          <div><div className="font-semibold text-base">12.5K</div><div className="text-xs text-gray-500">팔로워</div></div>
          <div><div className="font-semibold text-base">850</div><div className="text-xs text-gray-500">팔로잉</div></div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-4 pb-4">
        <input 
          value={profile.name}
          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
          className="block font-semibold text-sm bg-transparent outline-none w-full mb-1"
          placeholder="Display Name"
        />
        <textarea 
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          className="block text-sm text-gray-700 bg-transparent outline-none w-full resize-none leading-relaxed"
          rows={2}
          placeholder="Bio..."
        />
      </section>

      {/* Action Buttons */}
      <section className="px-4 flex gap-2 mb-6">
        <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">프로필 편집</button>
        <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">프로필 공유</button>
      </section>

      {/* Highlights */}
      <section className="px-4 pb-6 flex gap-4 overflow-x-auto no-scrollbar border-b border-gray-100">
        {highlights.map((h) => (
          <div key={h.id} className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <img src={h.image} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <input 
              value={h.title}
              onChange={(e) => {
                const newH = highlights.map(item => item.id === h.id ? { ...item, title: e.target.value } : item);
                setHighlights(newH);
              }}
              className="text-xs text-center w-16 bg-transparent outline-none truncate"
            />
          </div>
        ))}
        <label className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'highlight')} />
          <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center text-3xl text-gray-400 hover:bg-gray-50">+</div>
          <span className="text-xs text-gray-500">새로 만들기</span>
        </label>
      </section>

      {/* Tab Navigation */}
      <div className="flex">
        <div className="flex-1 py-3 flex justify-center border-b border-black">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
        <div className="flex-1 py-3 flex justify-center text-gray-300">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <div className="flex-1 py-3 flex justify-center text-gray-300">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </div>

      {/* Posts Grid (4:5 Ratio) */}
      <div className="grid grid-cols-3 gap-[1px] bg-gray-100">
        {/* Upload Post Button */}
        <label className="aspect-[4/5] bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'post')} />
          <span className="text-4xl text-gray-300">+</span>
        </label>
        
        {posts.map((post) => (
          <div key={post.id} className="aspect-[4/5] relative group overflow-hidden bg-white">
            <img src={post.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <button 
                onClick={() => setPosts(prev => prev.filter(p => p.id !== post.id))}
                className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
               >
                 삭제
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
