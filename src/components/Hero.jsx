import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import clip from "../assets/clip.mp4";

const Hero = ({ openShop }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6; // Slower for a more haunting feel
    }
  }, []);

  return (
    <section className="relative h-screen flex items-end overflow-hidden bg-[#050505]">
      
      {/* Video with Desaturation & Contrast */}
      <video
        ref={videoRef}
        src={clip}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50 opacity-60"
      />

      {/* Gothic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-10" />
      
      {/* Scanlines / CRT Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`, backgroundSize: '100% 2px, 3px 100%' }} 
      />

      {/* Vertical side label (Gothic style) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.5 }}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-6"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-red-900 to-transparent" />
        <p
          className="text-red-900/60 text-[10px] tracking-[0.6em] uppercase font-light"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", textShadow: '0 0 8px rgba(136, 8, 8, 0.4)' }}
        >
          Memento Mori
        </p>
        <div className="w-[1px] h-24 bg-gradient-to-t from-transparent via-red-900 to-transparent" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-30 w-full px-6 md:px-12 pb-14 md:pb-20">
        <div className="max-w-[1400px] mx-auto">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-[#880808] text-[11px] uppercase font-bold">
              EST. MMXXV — The Eternal Collection
            </span>
          </motion.div>

          {/* Headline Container */}
          <div className="relative mb-6">
            {/* Background "Ghost" Text */}
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 1, duration: 2 }}
              className="absolute -top-4 -left-2 text-[clamp(4rem,12vw,10rem)] font-serif italic text-red-700 blur-sm select-none"
            >
              Vintage
            </motion.h1>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="text-[clamp(4rem,12vw,10rem)] font-serif leading-none tracking-tighter text-white uppercase"
                style={{ textShadow: '2px 2px 0px #444' }}
              >
                Vintag<span className="text-red-900">e</span>
              </motion.h1>
            </div>

            <div className="flex items-baseline gap-4 md:gap-8 -mt-4 md:-mt-8">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.7, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                  className="text-[clamp(3.5rem,11vw,9rem)] font-serif italic leading-none text-white/40 uppercase"
                >
                  & Relics
                </motion.h1>
              </div>

              {/* Sub-content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 1 }}
                className="hidden lg:flex flex-col items-start gap-5 max-w-[280px]"
              >
                <p className="text-zinc-500 text-[11px] leading-relaxed uppercase tracking-widest">
                  Curated remnants of a forgotten era. Timeless. Dark. Divine.
                </p>
                <button
                  onClick={() => openShop(null, null)}
                  className="relative overflow-hidden group px-6 py-2 border border-zinc-800 hover:border-red-900 transition-colors duration-500"
                >
                  <span className="relative z-10 text-zinc-400 group-hover:text-white text-[10px] tracking-[0.4em] uppercase transition-colors">
                    Enter the Void
                  </span>
                  <div className="absolute inset-0 bg-red-950/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="lg:hidden mt-10 flex flex-col gap-6"
          >
            <button
              onClick={() => openShop(null, null)}
              className="text-red-800 text-[10px] tracking-[0.5em] uppercase font-bold border-b border-red-900/30 pb-2 w-max"
            >
              Shop the Shadows
            </button>
          </motion.div>

          {/* Bottom metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-16 pt-6 border-t border-zinc-900 flex items-center justify-between"
          >
            <div className="flex gap-8">
              <span className="text-zinc-700 text-[9px] tracking-[0.3em] uppercase">Global Haunting Available</span>
              <span className="text-zinc-700 text-[9px] tracking-[0.3em] uppercase hidden sm:block">Archive 001—25</span>
            </div>
            <div className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-900 shadow-[0_0_8px_#880808]" />
          </motion.div>

        </div>
      </div>

      {/* Custom Gothic Font Injection (Optional - for testing) */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </section>
  );
};

export default Hero;