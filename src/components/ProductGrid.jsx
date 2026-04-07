import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, LayoutList } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, filters, onOpenFilters, addToCart }) => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "dense"

  // ── FILTERING ──
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = filters.brand === "All" || product.brand === filters.brand;
      const categoryMatch = filters.category === "All" || product.category === filters.category;
      const subMatch = filters.subCategory === "All" || product.subCategory === filters.subCategory;
      return brandMatch && categoryMatch && subMatch;
    });
  }, [products, filters]);

  // ── SORTING ──
  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts];
    if (filters.sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    else if (filters.sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredProducts, filters.sort]);

  const headingLabel =
    filters.brand !== "All"
      ? filters.brand
      : filters.category !== "All"
      ? filters.category
      : "Collections";

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-10 pb-24">

      {/* ── HEADER ── */}
      <div className="mb-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block w-6 h-px bg-[#c8a96e]" />
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#c8a96e] font-bold">
            {filters.category !== "All" ? filters.category : "All Products"}
            {filters.subCategory !== "All" && ` · ${filters.subCategory}`}
          </p>
        </div>

        {/* Title row */}
        <div className="flex items-end justify-between gap-4 pb-5 border-b border-[#e8e5e0]">
          <div className="flex items-baseline gap-4">
            <h1
              className="text-4xl md:text-5xl font-black uppercase italic tracking-[-0.03em] leading-none text-[#111]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {headingLabel}
            </h1>
            <span className="text-[10px] text-black/30 tracking-[0.3em] uppercase font-bold pb-1">
              {sortedProducts.length} items
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="hidden md:flex items-center gap-1 border border-[#e0ddd8] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid" ? "bg-[#111] text-white" : "text-black/30 hover:text-black"
                }`}
              >
                <LayoutGrid size={13} strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode("dense")}
                className={`p-1.5 transition-colors ${
                  viewMode === "dense" ? "bg-[#111] text-white" : "text-black/30 hover:text-black"
                }`}
              >
                <LayoutList size={13} strokeWidth={2} />
              </button>
            </div>

            {/* Filter button */}
            <button
              onClick={onOpenFilters}
              className="group flex items-center gap-2.5 border border-[#111] px-5 py-2.5 text-[9px] uppercase tracking-[0.3em] font-black text-[#111] hover:bg-[#111] hover:text-white transition-all duration-200 active:scale-95"
            >
              <SlidersHorizontal size={12} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
              Filter & Sort
            </button>
          </div>
        </div>

        {/* Active filter pills */}
        {(filters.brand !== "All" || filters.category !== "All" || filters.subCategory !== "All") && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {[
              filters.brand !== "All" && filters.brand,
              filters.category !== "All" && filters.category,
              filters.subCategory !== "All" && filters.subCategory,
            ]
              .filter(Boolean)
              .map((pill) => (
                <span
                  key={pill}
                  className="flex items-center gap-1.5 border border-[#c8a96e] text-[#c8a96e] text-[8px] tracking-[0.25em] uppercase font-bold px-3 py-1"
                >
                  {pill}
                </span>
              ))}
          </motion.div>
        )}
      </div>

      {/* ── GRID ── */}
      <div
        className={`grid gap-x-4 gap-y-14 ${
          viewMode === "dense"
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product, index) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.04, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard product={product} addToCart={addToCart} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── EMPTY STATE ── */}
      <AnimatePresence>
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40 border-t border-[#eee]"
          >
            {/* Decorative lines */}
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-px bg-[#c8a96e]" />
              <span className="text-[#c8a96e] text-lg">∅</span>
              <span className="w-12 h-px bg-[#c8a96e]" />
            </div>

            <h2
              className="text-3xl font-black uppercase italic tracking-[-0.02em] text-[#111] mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              No Results
            </h2>
            <p className="text-[10px] text-black/35 uppercase tracking-[0.35em] font-medium mb-8 max-w-xs text-center">
              We couldn't find anything matching your filters. Try broadening your search.
            </p>

            <button
              onClick={onOpenFilters}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-black text-[#111] border-b border-[#111] pb-0.5 hover:text-[#c8a96e] hover:border-[#c8a96e] transition-colors duration-200"
            >
              Adjust Filters
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOAD MORE hint (cosmetic) ── */}
      {sortedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 flex flex-col items-center gap-3"
        >
          <div className="w-px h-8 bg-[#ddd]" />
          <p className="text-[8px] uppercase tracking-[0.4em] text-black/25 font-bold">
            {sortedProducts.length} of {sortedProducts.length} items shown
          </p>
        </motion.div>
      )}

    </div>
  );
};

export default ProductGrid;