import type { Metadata } from "next";
import "./globals.css";
import Secretary from "@/components/chatbot/Secretary";
import Navigation from "@/components/Navigation";

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
        <Navigation>{children}</Navigation>
        <Secretary />
      </body>
    </html>
  );
}
