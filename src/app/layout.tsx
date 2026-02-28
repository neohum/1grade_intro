import type { Metadata } from "next";
import { Jost, Nunito, Bubblegum_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const bubblegum = Bubblegum_Sans({
  variable: "--font-bubblegum",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "스스로 척척! 생활 습관",
  description: "초등학교 1학년 기본 생활 습관 도우미",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${jost.variable} ${nunito.variable} ${bubblegum.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
