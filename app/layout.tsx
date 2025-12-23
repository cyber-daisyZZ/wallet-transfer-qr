import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 配置本地字体 - 请将字体文件名替换为你的实际文件名
const customFont = localFont({
  src: "../fonts/crn_font_fbu_orderdetail.ttf", // 替换为你的字体文件名
  variable: "--crn_font_fbu_orderdetail",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Transfer",
  description: "Transfer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${customFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
