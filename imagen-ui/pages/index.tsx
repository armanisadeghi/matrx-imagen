// imagen-ui\pages\index.tsx

import React from 'react';
import Image from "next/image";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-[family-name:var(--font-geist-sans)]`}>
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Matrx IMAgen</h1>
        <p className="text-xl mb-8">Your comprehensive no-code AI image generation solution</p>
        <div className="flex gap-4">
          <a
            className="rounded-full bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition-colors"
            href="/playground"
          >
            Get Started
          </a>
          <a
            className="rounded-full border border-blue-500 text-blue-500 px-6 py-3 hover:bg-blue-50 transition-colors"
            href="/about"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}