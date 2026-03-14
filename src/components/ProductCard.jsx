import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";

const ProductCard = ({ product, addToCart }) => {
  // Local state para sa hover-to-sync image logic
  // Kung walang variants ang product, fallback tayo sa main img
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : { image: product.img, colorName: "Default" }
  );
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#f6f6f6] rounded-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedVariant.image} // Mahalaga para sa fade transition kapag nagpalit ng kulay
            src={selectedVariant.image}
            alt={product.title}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* FLOATING ACTION ICONS (Sync on Hover) */}
        <div className="absolute bottom-4 inset-x-4 flex gap-2">
          <motion.button 
            onClick={() => addToCart({ ...product, selectedVariant })}
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            className="flex-1 bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
          >
            <ShoppingBag size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Add to Bag</span>
          </motion.button>
          
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.05 }}
            className="w-12 bg-white text-black border border-black/5 flex items-center justify-center hover:bg-gray-100 transition-all"
          >
            <Heart size={14} />
          </motion.button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="mt-4 space-y-2.5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-tight leading-none group-hover:underline">
              {product.title}
            </h3>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1.5 font-bold">
              {product.brand}
            </p>
          </div>
          <span className="text-[11px] font-black italic">
            ₱{product.price.toLocaleString()}
          </span>
        </div>

        {/* COLOR BUBBLES - SYNC LOGIC */}
        {product.variants && (
          <div className="flex gap-2 pt-1">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onMouseEnter={() => setSelectedVariant(variant)} // Dito magpapalit ang image
                className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                  selectedVariant.colorName === variant.colorName 
                  ? "border-black scale-125 ring-1 ring-offset-1 ring-black/20" 
                  : "border-transparent"
                }`}
                style={{ backgroundColor: variant.colorHex }}
                title={variant.colorName}
              />
            ))}
          </div>
        )}

        <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em]">
          {selectedVariant.colorName}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;