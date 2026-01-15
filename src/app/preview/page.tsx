"use client";

import { useState } from "react";
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
    username: "gen.gentle",
    bio: "조용하지만 확실한 존재감 🌑",
    profilePic: ""
  });
  const [highlights, setHighlights] = useSyncData<Highlight[]>("ig_highlights", []);
  const [posts, setPosts] = useSyncData<Post[]>("ig_posts", []);
  
  const [uploading, setUploading] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<string | null>(null);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightImage, setHighlightImage] = useState("");

  const handleUpload = async (file: File, type: 'profile' | 'post' | 'highlight') => {
    setUploading(type);
    
    try {
      // 로그인 여부에 따라 Firebase Storage 또는 로컬 Blob URL 사용
      let url: string;
      
      if (auth.currentUser) {
        // Firebase Storage에 업로드
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/preview/${type}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        url = await getDownloadURL(snapshot.ref);
      } else {
        // 로컬 Blob URL 사용 (임시)
        url = URL.createObjectURL(file);
      }

      if (type === 'profile') {
        setProfile(prev => ({ ...prev, profilePic: url }));
      } else if (type === 'post') {
        setPosts(prev => [{ id: Math.random().toString(36).substring(7), image: url }, ...prev]);
      } else if (type === 'highlight') {
        setHighlights(prev => [...prev, { id: Math.random().toString(36).substring(7), title: "New", image: url }]);
      }
    } catch (e) {
      console.error("업로드 에러:", e);
      alert(`업로드 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    } finally {
      setUploading(null);
    }
  };

  const openHighlightEdit = (h: Highlight) => {
    setEditingHighlight(h.id);
    setHighlightTitle(h.title);
    setHighlightImage(h.image);
  };

  const saveHighlight = () => {
    if (editingHighlight) {
      setHighlights(prev => prev.map(h => h.id === editingHighlight ? { ...h, title: highlightTitle, image: highlightImage } : h));
      setEditingHighlight(null);
    }
  };

  const handleHighlightImageUpload = async (file: File) => {
    setUploading('highlight_edit');
    
    try {
      let url: string;
      
      if (auth.currentUser) {
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/preview/highlight/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        url = await getDownloadURL(snapshot.ref);
      } else {
        url = URL.createObjectURL(file);
      }

      setHighlightImage(url);
    } catch (e) {
      console.error("업로드 에러:", e);
      alert(`업로드 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    } finally {
      setUploading(null);
    }
  };

  const deleteHighlight = (id: string) => {
    if (confirm("이 하이라이트를 삭제하시겠습니까?")) {
      setHighlights(prev => prev.filter(h => h.id !== id));
      setEditingHighlight(null);
    }
  };

  const resetPreview = () => {
    if (confirm("프리뷰를 초기화하시겠습니까? 모든 데이터가 삭제됩니다.")) {
      setProfile({
        name: "Quietly Famous",
        username: "gen.gentle",
        bio: "조용하지만 확실한 존재감 🌑",
        profilePic: ""
      });
      setHighlights([]);
      setPosts([]);
    }
  };

  return (
    <div className="flex flex-col h-full divide-y divide-black bg-white">
      {/* Header */}
      <section className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs opacity-40">Preview</p>
            <h2 className="text-xl font-normal mt-2">
              Instagram Feed Preview
            </h2>
            <p className="text-sm leading-relaxed opacity-60 mt-3">
              요소를 클릭해 직접 수정하고 피드의 조화를 확인하세요.
            </p>
          </div>
          <button
            onClick={resetPreview}
            className="px-3 py-2 border border-black text-xs hover:bg-black hover:text-white transition-colors"
          >
            초기화
          </button>
        </div>
      </section>

      {/* Main Preview Area */}
      <main className="flex-1 bg-[#F5F5F2] p-6 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-[380px] bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-full font-sans text-black">
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between bg-white border-b border-gray-100">
              <span className="font-bold text-sm tracking-tight">{profile.username}</span>
              <div className="flex gap-5 text-xl">
                <span>⊕</span>
                <span>☰</span>
              </div>
            </header>

            {/* Profile Info */}
            <section className="p-4 flex gap-6 items-center">
              <label className="relative cursor-pointer group shrink-0">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'profile')} 
                />
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {uploading === 'profile' ? (
                          <span className="text-xs">...</span>
                        ) : profile.profilePic ? (
                          <img src={profile.profilePic} className="w-full h-full object-cover" alt="profile" />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-xs font-bold group-hover:bg-blue-600 transition-colors">
                  +
                </div>
              </label>
              
              <div className="flex-1 flex justify-around text-center">
                <div><div className="font-bold text-sm">{posts.length}</div><div className="text-[10px] text-gray-500">Posts</div></div>
                <div><div className="font-bold text-sm">12.5K</div><div className="text-[10px] text-gray-500">Followers</div></div>
                <div><div className="font-bold text-sm">850</div><div className="text-[10px] text-gray-500">Following</div></div>
              </div>
            </section>

            {/* Bio - Clickable */}
            <section className="px-4 pb-4">
              <button 
                onClick={() => setEditingProfile(true)}
                className="w-full text-left hover:bg-gray-50 -m-1 p-1 transition-colors group"
              >
                <p className="font-bold text-xs mb-0.5 group-hover:text-blue-500">{profile.name}</p>
                <p className="text-xs text-gray-800 whitespace-pre-wrap leading-tight">{profile.bio}</p>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100">클릭해서 수정</p>
              </button>
            </section>

            {/* Action Buttons */}
            <section className="px-4 flex gap-2 mb-6">
              <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors uppercase">Edit</button>
              <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors uppercase">Share</button>
            </section>

            {/* Highlights */}
            <section className="px-4 pb-6 flex gap-4 overflow-x-auto no-scrollbar border-b border-gray-100">
              {highlights.map((h) => (
                <button 
                  key={h.id}
                  onClick={() => openHighlightEdit(h)}
                  className="flex flex-col items-center gap-1 shrink-0 hover:opacity-70 transition-opacity"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 p-[1px] border border-gray-200">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <img src={h.image} className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-center w-14 truncate">{h.title}</span>
                </button>
              ))}
              <label className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'highlight')} 
                />
                <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center text-2xl text-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                  {uploading === 'highlight' ? '...' : '+'}
                </div>
                <span className="text-[10px] text-gray-400">NEW</span>
              </label>
            </section>

            {/* Tab Navigation */}
            <div className="flex">
              <div className="flex-1 py-3 flex justify-center border-b border-black">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <div className="flex-1 py-3 flex justify-center text-gray-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div className="flex-1 py-3 flex justify-center text-gray-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-[1px] bg-gray-100">
              {/* Upload Post Button */}
              <label className="aspect-[4/5] bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'post')} 
                />
                <span className="text-4xl text-gray-300 font-light">{uploading === 'post' ? '...' : '+'}</span>
                <span className="text-[10px] text-gray-400">Add Post</span>
              </label>
              
              {/* Render all posts */}
              {posts.map((post) => (
                <div key={post.id} className="aspect-[4/5] relative group overflow-hidden bg-white">
                  <img src={post.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={() => {
                        if (confirm("이 게시물을 삭제하시겠습니까?")) {
                          setPosts(prev => prev.filter(p => p.id !== post.id));
                        }
                      }}
                      className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Profile Edit Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingProfile(false)}>
          <div
            className="bg-white border-2 border-black w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-black bg-[#F5F5F2]">
              <h3 className="text-sm font-medium">Edit Profile</h3>
              <button onClick={() => setEditingProfile(false)} className="text-lg opacity-40 hover:opacity-100">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs opacity-40">Username</p>
                <input 
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-black text-sm outline-none bg-white"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs opacity-40">Display Name</p>
                <input 
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-black text-sm outline-none bg-white"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs opacity-40">Biography</p>
                <textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full h-24 px-3 py-2 border border-black text-sm outline-none bg-white resize-none"
                />
              </div>
            </div>

            <div className="border-t border-black">
              <button
                onClick={() => setEditingProfile(false)}
                className="w-full px-4 py-3 text-sm bg-black text-white hover:bg-opacity-80 transition-colors"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Highlight Edit Modal */}
      {editingHighlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingHighlight(null)}>
          <div
            className="bg-white border-2 border-black w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-black bg-[#F5F5F2]">
              <h3 className="text-sm font-medium">Edit Highlight</h3>
              <button onClick={() => setEditingHighlight(null)} className="text-lg opacity-40 hover:opacity-100">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs opacity-40">Image</p>
                <div className="flex items-center gap-3">
                  {highlightImage && (
                    <img src={highlightImage} className="w-16 h-16 rounded-full object-cover border border-black" />
                  )}
                  <label className="flex-1">
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleHighlightImageUpload(e.target.files[0])}
                    />
                    <div className="px-4 py-2 border border-black text-xs hover:bg-black hover:text-white transition-colors text-center cursor-pointer">
                      {uploading === 'highlight_edit' ? '업로드 중...' : '이미지 변경'}
                    </div>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs opacity-40">Title</p>
                <input 
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-black text-sm outline-none bg-white"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-black border-t border-black">
              <button
                onClick={() => deleteHighlight(editingHighlight)}
                className="px-4 py-3 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                삭제
              </button>
              <button
                onClick={saveHighlight}
                className="px-4 py-3 text-xs bg-black text-white hover:bg-opacity-80 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
