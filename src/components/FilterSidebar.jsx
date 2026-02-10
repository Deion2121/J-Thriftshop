import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterAccordion from "./FilterAccordion";

const FilterSidebar = ({ isOpen, onClose, filters, setFilters, allProducts = [] }) => {
  const brandOptions = ["Nike", "Adidas", "Polo RL", "Vans", "Converse", "Puma", "Tommy Hilfiger", "New Balance", "Reebok", "Fila", "Uniqlo", "Champion", "Carhartt", "Guess"];
  const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];
  const genderOptions = ["Men", "Women", "Unisex"]; 
  const sizeOptions = ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

  // LIVE COUNT LOGIC
  const filteredCount = useMemo(() => {
    return allProducts.filter(product => {
      const matchBrand = filters.brand === "All" || product.brand === filters.brand;
      const matchGender = !filters.gender || product.category === filters.gender;
      const matchSize = !filters.size || product.sizes?.includes(filters.size);
      return matchBrand && matchGender && matchSize;
    }).length;
  }, [filters, allProducts]);

  const handleUpdate = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? (key === 'brand' ? "All" : null) : value,
    }));
  };

  const clearAll = () => {
    setFilters({
      brand: "All",
      category: "All",
      subCategory: "All",
      size: null,
      sort: "Newest",
      gender: null
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* DARK OVERLAY - Minimalist blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-110 backdrop-blur-[2px]"
          />

          {/* SLIDING PANEL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-120 shadow-2xl flex flex-col"
          >
            {/* Header - Clean White with Black Text */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <div className="flex flex-col">
                <h2 className="text-xl font-black uppercase italic tracking-tight">
                  Filter & Sort
                </h2>
                <button 
                  onClick={clearAll}
                  className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors text-left font-bold mt-1 underline decoration-1"
                >
                  Clear All
                </button>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all"
              >
                <span className="text-2xl font-light">✕</span>
              </button>
            </div>

            {/* Content Area - Minimalist Spacing */}
            <div className="flex-1 overflow-y-auto p-6 space-y-1 custom-scrollbar">
              <FilterAccordion
                title="Sort By"
                items={sortOptions}
                selected={filters.sort}
                onSelect={(val) => handleUpdate("sort", val)}
              />

              <FilterAccordion
                title="Gender"
                items={genderOptions}
                selected={filters.gender}
                onSelect={(val) => handleUpdate("gender", val)}
              />

              <FilterAccordion
                title="Brands"
                items={brandOptions}
                selected={filters.brand}
                onSelect={(val) => handleUpdate("brand", val)}
              />

              <FilterAccordion
                title="Size"
                items={sizeOptions}
                selected={filters.size}
                onSelect={(val) => handleUpdate("size", val)}
              />
            </div>

            {/* Footer - Solid Black "Show Results" Button */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <button
                onClick={onClose}
                className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-zinc-800 flex justify-center items-center gap-3 active:scale-[0.98]"
              >
                Show Results
                <span className="text-gray-400 font-normal">
                  ({filteredCount})
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;