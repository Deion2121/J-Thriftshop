import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-20">
      
     
      <div className="flex justify-between items-center mb-8">
  <div className="flex items-baseline gap-2">
    <h1 className="text-3xl font-black uppercase italic tracking-tight">
      {filters.brand !== "" ? filters.brand : "All Products"}
    </h1>
    <span className="text-gray-400 text-[12px] font-bold">
      [{sortedProducts.length}]
    </span>
  </div>

        <button 
          onClick={onOpenFilters}
          className="flex items-center gap-3 border border-black px-6 py-2.5 font-bold uppercase text-[11px] tracking-widest hover:bg-gray-100 transition-all active:scale-95"
        >
          Filter & Sort 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M7 12H17M11 18H13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* PRODUCT GRID - Clean 4-Column Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product, index) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Container - Gray Background with Padding */}
              <div className="relative aspect-square bg-[#eceef0] overflow-hidden mb-3">
                <img 
                  src={product.img} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-in-out" 
                />
                
                {/* Mobile/Hover Quick Add */}
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="absolute bottom-0 left-0 w-full bg-black/80 text-white py-3 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                >
                  Add to Bag
                </button>
              </div>

              {/* Product Info - Minimalist Alignment */}
              <div className="space-y-0.5 px-1">
                <p className="font-bold text-[13px] md:text-[14px]">₱{product.price.toLocaleString()}</p>
                <h3 className="text-[13px] md:text-[14px] leading-tight group-hover:underline decoration-1">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-[11px] md:text-[12px]">
                  {product.brand} {product.category}
                </p>
                {/* Optional Status Label */}
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                  New
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EMPTY STATE */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-40 border-t border-gray-100 mt-10">
          <h2 className="text-xl font-black uppercase italic">No products found.</h2>
          <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">Adjust your filters to see more.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;