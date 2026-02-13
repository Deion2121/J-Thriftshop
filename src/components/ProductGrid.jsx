import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, filters, onOpenFilters, addToCart }) => {
  
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = filters.brand === "All" || product.brand === filters.brand;
      const categoryMatch = filters.category === "All" || product.category === filters.category;
      const subMatch = filters.subCategory === "All" || product.subCategory === filters.subCategory;
      return brandMatch && categoryMatch && subMatch;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts];
    if (filters.sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    else if (filters.sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredProducts, filters.sort]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 pt-6 md:pt-10 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter">
            {filters.brand !== "All" ? filters.brand : "Collections"}
          </h1>
          <span className="text-gray-400 text-[9px] md:text-[11px] font-bold tracking-[0.2em]">
            TOTAL {sortedProducts.length} ITEMS
          </span>
        </div>

        <button 
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-gray-800 transition-all active:scale-95"
        >
          Sort & Filter
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 6h18M7 12h10M11 18h2" />
          </svg>
        </button>
      </div>

      {/* FIXED GRID SYSTEM - Pinantay ang gaps at sizes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-14">
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product, index) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.02 }}
            >
              <ProductCard product={product} addToCart={addToCart} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductGrid;