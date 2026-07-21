import React from "react";

import Hero from "@/components/Home/Hero";
import TechLabSection from "@/components/LandingPage/TechLabSection";
import { IoChatbubbles } from "react-icons/io5";
import BlogSection from "@/components/Home/BlogSection";
import HomeTap from "@/components/Home/HomeTap";
import Link from "next/link";

export default function App() {
  return (
    <>
      <main className="pt-15">
        <Hero />
        <BlogSection />
        <TechLabSection />

        <HomeTap />
      </main>

      <Link
        className="fixed bottom-8 right-8 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 group hover:scale-110 active:scale-95 transition-all"
        href="/contactus"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
          <IoChatbubbles className={`text-white`} />
        </span>
      </Link>
    </>
  );
}
