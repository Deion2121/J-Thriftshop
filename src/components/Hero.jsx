import React from "react";
import { motion } from "framer-motion";
import clip from "../assets/clip.mp4";

const Hero = ({ openShop }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      
      {/* 1. VIDEO BACKGROUND WITH VHS EFFECT */}
      <div className="absolute inset-0 z-0">
        <video
          src={clip}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-70 grayscale-20%"
        />
        {/* Scanlines / Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60" />
      </div>

      {/* 2. FLOATING STICKERS (Retro/Busy Elements) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Sold Out Tag */}
        <motion.div 
          drag
          initial={{ x: -100, y: 100, rotate: -15 }}
          animate={{ y: [100, 110, 100] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-[20%] left-[10%] bg-red-600 text-white px-4 py-1 font-black text-xs uppercase tracking-tighter border-2 border-white shadow-xl md:block hidden"
        >
          Limited Drop
        </motion.div>

        {/* Price Tag Sticker */}
        <motion.div 
          initial={{ x: 200, y: 50, rotate: 10 }}
          animate={{ rotate: [10, 5, 10] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-[15%] right-[15%] bg-yellow-400 text-black p-3 font-mono text-[10px] leading-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <p>EST. 2025</p>
          <p className="text-lg font-black italic underline">$AVE BIG</p>
        </motion.div>

        {/* Circular "Authentic" Stamp */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute bottom-[25%] left-[15%] w-20 h-20 border-2 border-dashed border-white/40 rounded-full flex items-center justify-center text-[8px] text-white/40 font-bold uppercase text-center p-2"
        >
          Original • Vintage • Selected • 
        </motion.div>
      </div>

      {/* 3. MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-30 text-center px-6"
      >
        <div className="inline-block bg-white text-black px-2 py-1 mb-4 text-[10px] font-black uppercase tracking-[0.3em]">
          BUDGET-FRIENDLY FINDS
        </div>
        
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase italic leading-[0.8] tracking-tighter text-white">
          THRIFT <br  /> 
          <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '2px white' }}>
              ARCHIVE
          </span>
        </h1>

        <p className="mt-6 text-sm md:text-base font-bold uppercase tracking-widest text-gray-300 max-w-xl mx-auto drop-shadow-lg">
          "One man’s trash is another man’s treasure"
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openShop("All", "All")}
            className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Enter the Shop
          </button>
          {/* <div className="text-white font-mono text-[10px] uppercase tracking-tighter opacity-60">
            Next Drop: 02.24.26
          </div> */}
        </div>
      </motion.div>

      {/* 4. BOTTOM MARQUEE (Busy Effect) */}
      <div className="absolute bottom-0 w-full bg-white text-black py-2 overflow-hidden whitespace-nowrap z-40 border-t-2 border-black">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-10 font-black uppercase text-sm tracking-tighter"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i}>100% Sustainable • Good As New • Handpicked in Cavite• Wear the Past •</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;