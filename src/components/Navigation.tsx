"use client";

import { useState } from "react";
import AuthButton from "@/components/AuthButton";

export default function Navigation({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="border-b border-black bg-white sticky top-0 z-50">
        <div className="flex items-center">
          {/* Mobile: Hamburger + Title */}
          <div className="flex items-center justify-between w-full lg:hidden px-4 py-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-black hover:text-white transition-colors"
              aria-label="Menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <h1 className="text-sm font-normal">Quietly Famous</h1>
            <span className="text-xs opacity-40">v.25</span>
          </div>

          {/* Desktop: Original Layout */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto] w-full">
            <div className="px-6 py-3 flex items-center justify-between border-r border-black">
              <h1 className="text-sm font-normal">
                Quietly Famous <span className="opacity-40">&gt;</span> Influencer Management Tool
              </h1>
            </div>
            <div className="px-6 py-3 flex items-center gap-4">
              <AuthButton />
              <span className="text-xs opacity-40">v.25</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div
            className="fixed top-[57px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <nav
          className={`
            fixed lg:static top-[57px] left-0 bottom-0 z-40
            w-64 lg:w-48 border-r border-black bg-white
            transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0 shadow-[2px_0_8px_rgba(0,0,0,0.1)]' : '-translate-x-full lg:translate-x-0'}
            flex flex-col
          `}
        >
          <NavLink href="/" label="The Desk" onClick={() => setMenuOpen(false)} />
          <NavLink href="/calendar" label="Calendar" onClick={() => setMenuOpen(false)} />
          <NavLink href="/archive" label="Archive" onClick={() => setMenuOpen(false)} />
          <NavLink href="/benchmarking" label="Reference" onClick={() => setMenuOpen(false)} />
          <NavLink href="/templates" label="Cheat Key" onClick={() => setMenuOpen(false)} />
          <NavLink href="/preview" label="Preview" onClick={() => setMenuOpen(false)} />
          
          {/* Mobile Only: Auth in Menu */}
          <div className="mt-auto border-t border-black p-4 lg:hidden">
            <AuthButton />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-50px)] bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="px-6 py-4 border-b border-black text-sm hover:bg-black hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}
