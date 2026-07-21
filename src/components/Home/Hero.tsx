import React from "react";
import Link from "next/link";
import Image from "next/image";
import hero from "../../../public/images/homeImage.webp";
import { IoChatbubbles } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-on-background">
      <div className="absolute inset-0 z-0">
        <Image
          src={hero}
          alt="Sprint Athlete"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-background via-on-background/40 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 w-full relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-primary-brand" />
            <span className="text-primary-brand font-bold uppercase tracking-[0.3em] text-sm">
              Fall 2024 Series
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic mb-8 tracking-tighter leading-none">
            KINETIC
            <br />
            <span className="text-primary-brand">VELOCITY</span>
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-lg">
            Push past your limits with gear engineered for elite performance.
            Experience the future of speed with Kinetic Foam technology.
          </p>
          <div className="flex flex-wrap gap-4 font-bold uppercase tracking-widest text-sm">
            <Link
              href="/products"
              className="bg-primary-brand text-on-primary px-10 py-5 hover:bg-white hover:text-on-background transition-all rounded-sm flex items-center gap-2 group"
            >
              Shop Now
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                <FaArrowRightLong />
              </span>
            </Link>
            <Link
              href="/contactus"
              className="border border-white/30 text-white px-10 py-5 hover:bg-white/10 transition-all rounded-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
