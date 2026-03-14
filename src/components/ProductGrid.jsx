import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard"; // Import natin ang card na may hover logic

const ProductGrid = ({ products, filters, onOpenFilters, addToCart }) => {
  
  // 1. FILTERING & SORTING LOGIC
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
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-10 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            {filters.brand !== "All" ? filters.brand : "Collections"}
          </h1>
          <span className="text-gray-400 text-[12px] font-bold tracking-widest">
            [{sortedProducts.length} ITEMS]
          </span>
        </div>

        <button 
          onClick={onOpenFilters}
          className="flex items-center gap-3  px-6 py-2.5 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black hover:text-white transition-all active:scale-95"
        >
          Filter & Sort 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M7 12H17M11 18H13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* PRODUCT GRID - Synced with ProductCard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16">
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product, index) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              {/* Dito tinatawag ang ProductCard para sa Hover-to-Sync Image feature */}
              <ProductCard 
                product={product} 
                addToCart={addToCart} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EMPTY STATE */}
      {sortedProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 border-t border-gray-50 mt-10"
        >
          <h2 className="text-xl font-black uppercase italic tracking-tighter">No products found</h2>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.3em]">
            Try adjusting your filters or search terms.
          </p>
          
        </motion.div>
      )}
    </div>
  );
};
export default ProductGrid;