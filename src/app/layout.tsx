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
      <body className="antialiased selection:bg-[#8A9A8A] selection:text-white">
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Side Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F5F2]/80 backdrop-blur-md border-t border-[var(--border)] md:relative md:w-48 md:h-screen md:border-t-0 md:border-r flex md:flex-col justify-around md:justify-start gap-8 p-6">
            <div className="hidden md:block mb-12">
              <h1 className="text-xl font-serif italic tracking-tight">Quietly Famous.</h1>
              <p className="mono mt-2">v. 2025</p>
            </div>
            
            <NavLink href="/" label="The Desk" />
            <NavLink href="/calendar" label="Calendar" />
            <NavLink href="/archive" label="Archive" />
            <NavLink href="/benchmarking" label="Model" />
            <NavLink href="/templates" label="Cheat Key" />
            <NavLink href="/preview" label="Preview" />

            <div className="hidden md:block mt-auto">
              <AuthButton />
            </div>
          </nav>

          <main className="flex-1 p-6 md:p-16 max-w-4xl mx-auto w-full">
            {children}
          </main>
        </div>
        <Secretary />
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group flex flex-col items-start gap-1">
      <span className="text-sm font-serif transition-colors group-hover:text-[#8A9A8A]">{label}</span>
      <div className="h-[1px] w-0 group-hover:w-full bg-[#8A9A8A] transition-all duration-300"></div>
    </a>
  );
}
