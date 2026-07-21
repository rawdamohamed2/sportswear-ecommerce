import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-20 h-dvh w-full flex flex-col justify-between items-center bg-background-custom text-darkgray">
      <header className="w-full pt-12 flex justify-center items-center">
        <Link className="text-primary text-4xl logo ps-3 sm:p-0" href={"/"}>
          SPORTSW
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="relative flex items-center justify-center w-40 h-40">
          <div className="absolute inset-0 rounded-full border-4 border-outline-variant" />
          <Compass strokeWidth={1.5} className="h-16 w-16 text-primary" />
        </div>

        <div className="space-y-4">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">
            Error 404
          </p>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[1.05]">
            OFF <span className="text-primary">TRACK</span>
          </h1>
          <p className="text-base md:text-lg text-Fsecondary max-w-md mx-auto">
            Looks like this page ran out of bounds. Let&apos;s get you back in
            the game.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-primary text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </main>

      <footer className="w-full px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest/30">
        <p className="text-xs font-bold uppercase tracking-wider text-Fsecondary">
          © {new Date().getFullYear()} SPORTSW. Engineered for performance.
        </p>
        <div className="flex gap-6">
          <Link
            href="/contactus"
            className="text-xs font-bold uppercase text-darkgray hover:text-primary transition-colors"
          >
            Support
          </Link>
          <Link
            href="#"
            className="text-xs font-bold uppercase text-darkgray hover:text-primary transition-colors"
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
