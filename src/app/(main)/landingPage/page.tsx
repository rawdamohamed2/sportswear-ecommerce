"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Footprints, Timer } from "lucide-react";
import Link from "next/link";

const icons = [Footprints, Dumbbell, Timer];

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 96 ? 96 : prev + Math.random() * 10));
    }, 400);

    const iconInterval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 900);

    return () => {
      clearInterval(progressInterval);
      clearInterval(iconInterval);
    };
  }, []);

  return (
    <div className="py-20 h-dvh w-full flex flex-col justify-between items-center bg-background-custom text-darkgray selection:bg-primary selection:text-font">
      <header className="w-full py-12 flex justify-center items-center">
        <Link className="text-primary text-4xl logo ps-3 sm:p-0" href={"/"}>
          SPORTSW
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center gap-10">
        <div className="relative flex items-center justify-center w-48 h-48">
          <div className="absolute inset-0 rounded-full border-4 border-outline-variant" />
          <div
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            style={{ animationDuration: "1.4s" }}
          />

          <div className="relative w-full h-full flex items-center justify-center">
            {icons.map((Icon, index) => (
              <Icon
                key={index}
                strokeWidth={1.75}
                className={`absolute h-12 w-12 text-primary transition-opacity duration-500 ${
                  activeIcon === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[1.05]">
            PREPARING YOUR <span className="text-primary">PERFORMANCE</span>
          </h1>
          <p className="text-base md:text-lg text-Fsecondary tracking-widest uppercase">
            Loading the latest gear...
          </p>
        </div>

        <div className="w-full max-w-md">
          <Progress
            value={progress}
            className="h-1.5 bg-surface-container-highest [&>div]:bg-primary"
          />
        </div>
      </main>

      <footer className="w-full px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest/30">
        <p className="text-xs font-bold uppercase tracking-wider text-Fsecondary">
          © {new Date().getFullYear()} SPORTSW. Engineered for performance.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-xs font-bold uppercase text-darkgray hover:text-primary transition-colors"
          >
            Support
          </a>
          <a
            href="#"
            className="text-xs font-bold uppercase text-darkgray hover:text-primary transition-colors"
          >
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
