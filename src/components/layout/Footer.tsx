"use client";
import React from "react";
import Link from "next/link";
import { GrLanguage } from "react-icons/gr";
import { FaShare } from "react-icons/fa";
import { SlFeed } from "react-icons/sl";

const Footer: React.FC = () => {
  return (
    <>
      <section className="py-16 bg-on-background relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic mb-6 leading-none">
              JOIN THE ELITE
            </h2>
            <p className="text-white/60 text-lg mb-10 uppercase tracking-widest">
              Early access to drops. Exclusive training protocols. Zero noise.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col md:flex-row gap-0 border-2 border-white/10 group focus-within:border-primary transition-colors"
            >
              <input
                className="flex-grow bg-transparent border-none text-white font-bold px-8 py-5 focus:outline-none placeholder:text-white/30 uppercase text-sm"
                placeholder="ENTER YOUR EMAIL"
                type="email"
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold px-12 py-5 uppercase tracking-widest hover:bg-white hover:text-on-background transition-all"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-6 text-white/30 text-[10px] uppercase tracking-widest">
              By subscribing, you agree to our privacy policy &amp; terms of
              service.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 kinetic-gradient opacity-10 pointer-events-none"></div>
      </section>

      <footer className="bg-white border-t border-outline py-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 text-darkgray lg:grid-cols-4 gap-16 mb-16">
            <div className="flex flex-col gap-3">
              <Link className="text-primary logo " href={"/"}>
                SPORTSW
              </Link>
              <p className="text-on-surface-variant text-base max-w-xs">
                Engineered for the athlete of the future. High-performance gear
                developed in collaboration with elite sports scientists.
              </p>
              <div className="flex text-primary gap-4">
                <Link
                  className="w-10 h-10 border border-secondary-fixed-dim flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                  href="#"
                >
                  <GrLanguage className="material-symbols-outlined text-xl" />
                </Link>
                <Link
                  className="w-10 h-10 border border-secondary-fixed-dim flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                  href="#"
                >
                  <FaShare className="material-symbols-outlined text-xl" />
                </Link>
                <Link
                  className="w-10 h-10 border border-secondary-fixed-dim  flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                  href="#"
                >
                  <SlFeed className="material-symbols-outlined text-xl" />
                </Link>
              </div>
            </div>

            <div className={`md:text-start text-center`}>
              <h5 className="font-bold  uppercase mb-6 tracking-widest text-sm">
                Shop Gear
              </h5>
              <ul className="flex flex-col gap-4 text-on-surface-variant text-sm">
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Men's Performance
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Women's Elite
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Kinetic Footwear
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Lab Series
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Digital Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            <div className={`md:text-start text-center`}>
              <h5 className="font-bold uppercase mb-6 tracking-widest text-sm">
                Experience
              </h5>
              <ul className="flex flex-col gap-4 text-on-surface-variant text-sm">
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Our Technology
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Elite Program
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Sustainability Lab
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Store Locator
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    SPORTSW+ Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            <div className={`md:text-start text-center`}>
              <h5 className="font-bold uppercase mb-6 tracking-widest text-sm">
                Support
              </h5>
              <ul className="flex flex-col gap-4 text-on-surface-variant text-sm">
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Product Care
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Corporate Sales
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Contact Expert
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-outline pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">
              © 2024 SPORTSW PERFORMANCE CO. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <Link className="hover:text-primary transition-colors" href="#">
                Privacy Policy
              </Link>
              <Link className="hover:text-primary transition-colors" href="#">
                Terms of Use
              </Link>
              <Link className="hover:text-primary transition-colors" href="#">
                CA Supply Chain
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
