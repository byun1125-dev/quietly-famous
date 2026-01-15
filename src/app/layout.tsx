import type { Metadata } from "next";
import "./globals.css";
import Secretary from "@/components/chatbot/Secretary";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "QUIETLY FAMOUS",
  description: "Creative Practice for Influencer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="antialiased selection:bg-black selection:text-white min-h-screen p-4 md:p-10 bg-[#EBEBE6]">
        {/* Main Grid Frame */}
        <div className="grid-container bg-[#F5F5F2] max-w-[1400px] mx-auto overflow-hidden">
          {/* Top Bar */}
          <header className="grid grid-cols-1 md:grid-cols-[1fr_200px_80px] border-b border-black">
            <div className="p-4 md:px-8 md:py-6 flex items-center justify-between border-r border-black">
              <h1 className="text-xl font-bold tracking-tighter uppercase">Quietly Famous.</h1>
              <p className="mono hidden md:block text-[#8A9A8A]">Influencer Management Tool</p>
            </div>
            <div className="p-4 flex items-center justify-center border-r border-black">
              <AuthButton />
            </div>
            <div className="p-4 flex items-center justify-center mono font-bold">
              v.25
            </div>
          </header>

          <div className="flex flex-col md:flex-row">
            {/* Side Navigation */}
            <nav className="w-full md:w-48 border-r border-black flex md:flex-col shrink-0 overflow-x-auto md:overflow-x-visible no-scrollbar">
              <NavLink href="/" label="The Desk" />
              <NavLink href="/calendar" label="Calendar" />
              <NavLink href="/archive" label="Archive" />
              <NavLink href="/benchmarking" label="Model" />
              <NavLink href="/templates" label="Cheat Key" />
              <NavLink href="/preview" label="Preview" />
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 min-h-[80vh] bg-white">
              {children}
            </main>
          </div>
        </div>
        <Secretary />
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      className="flex-1 md:flex-none p-4 md:px-8 md:py-6 border-b border-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center md:justify-start group"
    >
      <span className="relative">
        {label}
        <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8A9A8A] transition-all duration-300 group-hover:w-full"></div>
      </span>
    </a>
  );
}
