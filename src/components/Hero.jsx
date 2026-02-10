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
          Vintage & Thrift finds
        </motion.h1>

        <p className="mt-5 text-md sm:text-xl md:text-2xl font-serif tracking-wide text-gray-200 max-w-3xl mx-auto">
          One man’s trash is another man’s treasure
        </p>
        <button
          onClick={() => openShop(null, null)}
          className="mt-8 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-500 transition"
        >
          Shop Now
        </button>
        </motion.div>
    </section>
  );
};

export default Hero;
