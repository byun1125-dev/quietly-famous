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
      <body className="antialiased selection:bg-black selection:text-white bg-[#F5F5F2]">
        {/* Main Grid Container - 이미지와 동일한 구조 */}
        <div className="min-h-screen border-l border-t border-black">
          {/* Top Bar - 매우 얇은 상단 바 */}
          <header className="grid grid-cols-[1fr_auto] border-b border-black">
            <div className="px-6 py-3 flex items-center justify-between border-r border-black">
              <h1 className="text-sm font-normal">Quietly Famous <span className="opacity-40">&gt;</span> Influencer Management Tool</h1>
            </div>
            <div className="px-6 py-3 flex items-center gap-4">
              <AuthButton />
              <span className="text-xs opacity-40">v.25</span>
            </div>
          </header>

          <div className="flex">
            {/* Left Sidebar - 이미지처럼 매우 좁은 세로 메뉴 */}
            <nav className="w-48 border-r border-black flex flex-col bg-white">
              <NavLink href="/" label="The Desk" />
              <NavLink href="/calendar" label="Calendar" />
              <NavLink href="/archive" label="Archive" />
              <NavLink href="/benchmarking" label="Model" />
              <NavLink href="/templates" label="Cheat Key" />
              <NavLink href="/preview" label="Preview" />
            </nav>

            {/* Main Content - 우측 넓은 영역 */}
            <main className="flex-1 min-h-[calc(100vh-50px)] bg-white">
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
      className="px-6 py-4 border-b border-black text-sm hover:bg-black hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}
