import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BrandHeader from "@/components/BrandHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GentlemanVibe Time",
  description: "데스크테리어용 프리미엄 디지털/아날로그 클락 & 타이머 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <BrandHeader />
        {children}
      </body>
    </html>
  );
}
