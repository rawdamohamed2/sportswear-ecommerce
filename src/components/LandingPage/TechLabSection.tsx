import React from "react";
import unnamed from "../../../public/images/unnamed.jpg";
import Image from "next/image";
import { MdOutlinePlayArrow } from "react-icons/md";
import Link from "next/link";

const TechLabSection = () => {
  return (
    <section className="bg-on-background text-white py-16 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
        <span className="text-[300px] font-black italic leading-none absolute top-1/2 -translate-y-1/2 right-[-50px]">
          LAB
        </span>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="relative aspect-square">
          <Image
            className="w-full h-full object-contain"
            alt="Futuristic running shoe showing carbon fiber sole"
            src={unnamed}
          />
          <div className="absolute top-0 right-0 bg-primary/20 backdrop-blur-xl border border-white/10 p-6 max-w-xs animate-pulse">
            <p className="font-bold text-primary uppercase text-xs mb-2">
              Live Innovation
            </p>
            <h4 className="text-sm font-semibold uppercase mb-2">
              Kinetic Foam™
            </h4>
            <p className="text-white/60 text-xs">
              98% energy return measured in laboratory peak performance testing.
            </p>
          </div>
        </div>

        <div>
          <span className="text-primary font-bold uppercase tracking-[0.4em] mb-4 block">
            Innovation Lab
          </span>
          <h2 className="text-4xl md:text-5xl font-bold uppercase italic mb-8">
            ENGINEERED
            <br />
            <span className="text-primary">BEYOND HUMAN</span>
          </h2>
          <p className="text-white/60 text-lg mb-10">
            At SPORTSW, we don't just make gear; we engineer kinetic advantages.
            Every stitch, every fiber, and every molecule of foam is designed to
            decrease friction and increase velocity.
          </p>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="border-l-2 border-primary pl-6">
              <span className="block text-4xl font-extrabold leading-none mb-1">
                12%
              </span>
              <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
                Power Increase
              </span>
            </div>
            <div className="border-l-2 border-primary pl-6">
              <span className="block text-4xl font-extrabold leading-none mb-1">
                -24g
              </span>
              <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
                Weight reduction
              </span>
            </div>
          </div>

          <Link
            className="inline-flex items-center gap-4 group"
            href="/products"
          >
            <span className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
              <MdOutlinePlayArrow
                className="material-symbols-outlined"
                size={26}
              />
            </span>
            <span className="font-bold uppercase tracking-widest text-sm group-hover:text-primary transition-colors">
              See The Products
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default TechLabSection;
