import React from "react";
import { motion } from "framer-motion";
import clip from "../assets/clip.mp4";

const Hero = ({ openShop }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        src={clip}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 text-center text-white px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight"
        >
          The New Standard of Style
        </motion.h1>

        <p className="mt-5 text-lg sm:text-xl md:text-2xl font-light tracking-wide text-gray-200 max-w-2xl mx-auto">
          Discover timeless fashion crafted with elegance and precision.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} className="mt-10 inline-block">
          <button
            onClick={openShop}
            className="border border-white text-white px-8 py-3 text-sm sm:text-base tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300 font-medium rounded"
          >
            Shop Now
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
