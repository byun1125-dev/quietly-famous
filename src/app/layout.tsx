import type { Metadata } from "next";
import "./globals.css";
import Secretary from "@/components/chatbot/Secretary";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "QUIETLY FAMOUS",
  description: "The Manager's Desk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-[#FF5C00] selection:text-white">
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Minimal Sidebar */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black md:relative md:w-20 md:h-screen md:border-t-0 md:border-r-2 flex md:flex-col justify-around md:justify-center items-center gap-8 py-4 md:py-0">
            <NavLink href="/" icon="D" label="Desk" />
            <NavLink href="/archive" icon="C" label="Closet" />
            <NavLink href="/benchmarking" icon="M" label="Model" />
            <NavLink href="/templates" icon="T" label="Templates" />
            <NavLink href="/preview" icon="P" label="Preview" />
          </nav>

          <main className="flex-1 p-6 md:p-20 mb-20 md:mb-0 max-w-5xl mx-auto w-full">
            <header className="flex justify-between items-start mb-20">
              <h1 className="text-4xl font-black italic tracking-tighter">QUIETLY FAMOUS.</h1>
              <AuthButton />
            </header>
            {children}
          </main>
        </div>
        <Secretary />
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a href={href} className="group relative flex flex-col items-center">
      <span className="text-xl font-black transition-colors group-hover:text-[#FF5C00]">{icon}</span>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 hidden group-hover:block whitespace-nowrap">
        {label}
      </span>
    </a>
  );
}
