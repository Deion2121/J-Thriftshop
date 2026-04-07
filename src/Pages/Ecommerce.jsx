import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chhood from "../assets/carhartt/chhood.png";
import s from "../assets/s.png";
import nb from "../assets/nb.png";

const featuredProducts = [
  { id: 101, title: "Premium Trouser", price: 135, img: chhood, category: "MEN", tag: "Bestseller" },
  { id: 102, title: "Urban Sling Bag", price: 55, img: s, category: "WOMEN", tag: "New Arrival" },
  { id: 103, title: "Classic Basic Tee", price: 35, img: nb, category: "MEN", tag: "Staff Pick" },
];

const Ecommerce = ({ addToCart, filters }) => {
  const [addedMessage, setAddedMessage] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedMessage(product.title);
    setTimeout(() => setAddedMessage(null), 2500);
  };

  if (filters.category !== "All" || filters.subCategory !== "All") return null;

  return (
    <section className="relative bg-[#f9f7f4] py-20 px-4 md:px-12 overflow-hidden">

      {/* Background texture grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Toast notification */}
      <AnimatePresence>
        {addedMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#111] text-white px-5 py-3 shadow-2xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#c8a96e] inline-block animate-pulse" />
            <span className="text-xs tracking-[0.15em] uppercase">{addedMessage} added to cart</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-14 border-b border-[#ddd] pb-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#999] mb-2 font-medium">
              Curated Collection
            </p>
            <h2
              className="text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.03em] text-[#111]"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
            >
              Must-Haves
            </h2>
          </div>
          <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-[#aaa] pb-1">
            Season 2025
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#e0ddd8]">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onHoverStart={() => setHoveredId(product.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative bg-[#f9f7f4] overflow-hidden group"
            >
              {/* Tag badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#111] text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 font-bold">
                  {product.tag}
                </span>
              </div>

              {/* Category pill */}
              <div className="absolute top-4 right-4 z-20">
                <span className="border border-[#aaa] text-[#777] text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 bg-white/80 backdrop-blur-sm">
                  {product.category}
                </span>
              </div>

              {/* Image container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#edeae5]">
                <motion.img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: hoveredId === product.id ? 1.07 : 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />

                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-[#111]/40 flex items-end justify-center pb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === product.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={() => handleAddToCart(product)}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{
                      y: hoveredId === product.id ? 0 : 12,
                      opacity: hoveredId === product.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="bg-white text-[#111] text-[10px] tracking-[0.3em] uppercase font-bold px-8 py-3 hover:bg-[#c8a96e] hover:text-white transition-colors duration-200 shadow-xl"
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              </div>

              {/* Product info */}
              <div className="px-5 py-5 flex items-center justify-between">
                <div>
                  <h3
                    className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#111] leading-tight"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {product.title}
                  </h3>
                  <p className="text-[#888] text-xs tracking-wide mt-0.5 uppercase">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#111] font-black text-base tracking-tight">
                    ₱{product.price.toLocaleString()}
                  </p>
                  {/* Quick-add icon button for mobile */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-1 sm:hidden inline-flex items-center justify-center w-7 h-7 border border-[#ccc] hover:bg-[#111] hover:border-[#111] hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bottom accent line on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-[#c8a96e]"
                initial={{ width: "0%" }}
                animate={{ width: hoveredId === product.id ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 flex justify-center">
          <button className="group flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase font-bold text-[#111] border-b border-[#111] pb-0.5 hover:text-[#c8a96e] hover:border-[#c8a96e] transition-colors duration-200">
            View Full Collection
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Ecommerce;