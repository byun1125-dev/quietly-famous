"use client";

import { useSyncData } from "@/hooks/useSyncData";
import { useState } from "react";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type ArchiveItem = {
  id: string;
  type: 'image' | 'video' | 'note';
  content: string; // URL or Note text
  title: string;
  createdAt: number;
};

export default function ArchivePage() {
  const [items, setItems] = useSyncData<ArchiveItem[]>("archive_data", []);
  const [uploading, setUploading] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/archive/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setItems(prev => [{ id: Math.random().toString(36).substring(7), type: 'image', content: url, title: "Mood", createdAt: Date.now() }, ...prev]);
    } finally { setUploading(false); }
  };

  const addNote = () => {
    if (!newNote) return;
    setItems(prev => [{ id: Math.random().toString(36).substring(7), type: 'note', content: newNote, title: "Idea", createdAt: Date.now() }, ...prev]);
    setNewNote("");
  };

  return (
    <div className="space-y-12">
      <header className="card-minimal">
        <p className="mono mb-2">Collection</p>
        <h2 className="text-4xl font-serif italic">The Archive.</h2>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Note Input */}
        <div className="p-6 bg-white border border-[var(--border)] space-y-4">
          <p className="mono">Add Note/Idea</p>
          <textarea 
            placeholder="떠오르는 아이디어를 적으세요..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full bg-transparent font-serif italic h-24 resize-none outline-none"
          />
          <button onClick={addNote} className="text-xs font-black uppercase tracking-widest text-[#8A9A8A] underline">Save Note</button>
        </div>
        
        {/* File/Link Upload */}
        <label className="p-6 bg-[#EBEBE6] border border-dashed border-[var(--border)] flex flex-col items-center justify-center cursor-pointer group">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          <p className="mono mb-2 group-hover:text-[#8A9A8A] transition-colors">Upload Moodboard Image</p>
          <span className="text-2xl font-light opacity-30">{uploading ? "..." : "+"}</span>
        </label>
      </div>

      <div className="columns-2 md:columns-3 gap-6 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid border border-[var(--border)] bg-white p-4">
            {item.type === 'image' && <img src={item.content} className="w-full h-auto mb-3" />}
            {item.type === 'note' && <p className="font-serif italic text-sm mb-3 leading-relaxed">"{item.content}"</p>}
            <div className="flex justify-between items-center">
              <span className="mono opacity-30 text-[9px]">{new Date(item.createdAt).toLocaleDateString()}</span>
              <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="mono hover:text-red-300 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
