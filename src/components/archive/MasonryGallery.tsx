"use client";

import { useState } from "react";
import { useSyncData } from "@/hooks/useSyncData";
import { auth, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // uuid 설치가 필요할 수 있으나 일단 로직 구현

type ClosetItem = {
  id: string;
  url: string;
  title: string;
  type: string;
  createdAt: number;
};

export default function MasonryGallery() {
  const [items, setItems] = useSyncData<ClosetItem[]>("closet_items", []);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/closet/${Date.now()}_${file.name}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newItem: ClosetItem = {
        id: Math.random().toString(36).substring(7),
        url: downloadURL,
        title: "새로운 레퍼런스",
        type: "Photo",
        createdAt: Date.now()
      };

      setItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("사진 업로드에 실패했습니다. Storage 설정을 확인해주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {/* Upload Button */}
        <label className="break-inside-avoid border-2 border-dashed border-black aspect-[3/4] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
          <span className="text-4xl font-light">{uploading ? "..." : "+"}</span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {uploading ? "Uploading" : "Add Reference"}
          </span>
        </label>

        {items.map((item) => (
          <div 
            key={item.id} 
            className="relative break-inside-avoid border-2 border-black overflow-hidden group"
          >
            <img src={item.url} alt={item.title} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <span className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-widest mb-1">{item.type}</span>
              <p className="text-white font-black text-sm uppercase tracking-tighter">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
