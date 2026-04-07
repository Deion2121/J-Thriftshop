import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";

const ProductCard = ({ product, addToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : { image: product.img, colorName: "Default" }
  );
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedVariant });
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1500);
  };

  const displayImage = selectedVariant.image || product.img;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efefec]">

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={displayImage}
            src={displayImage}
            alt={product.title}
            initial={{ opacity: 0.7, scale: 1.03 }}
            animate={{ opacity: 1, scale: isHovered ? 1.06 : 1 }}
            exit={{ opacity: 0.7 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient vignette on hover for readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Badges — top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-[#111] text-white text-[8px] tracking-[0.2em] uppercase font-bold px-2 py-0.5">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-[#c8a96e] text-black text-[8px] tracking-[0.2em] uppercase font-bold px-2 py-0.5">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist — top-right (always visible, more prominent on hover) */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
        >
          <motion.div
            animate={{ scale: wishlisted ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={13}
              strokeWidth={2}
              className={wishlisted ? "fill-red-500 stroke-red-500" : "stroke-black/50"}
            />
          </motion.div>
        </button>

        {/* Add to Bag — slides up from bottom */}
        <div className="absolute bottom-0 inset-x-0 px-3 pb-3 z-10">
          <motion.button
            onClick={handleAddToCart}
            initial={{ y: 16, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full flex items-center justify-center gap-2 py-3 text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-200 relative overflow-hidden"
            style={{
              backgroundColor: addedFlash ? "#c8a96e" : "#111",
              color: addedFlash ? "#111" : "#fff",
            }}
          >
            <ShoppingBag size={12} strokeWidth={2.5} />
            <span>{addedFlash ? "Added!" : "Add to Bag"}</span>
          </motion.button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="mt-3.5 space-y-2">

        {/* Title + Price row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[11px] font-black uppercase tracking-[0.04em] leading-tight truncate group-hover:text-[#c8a96e] transition-colors duration-200"
              style={{ fontFamily: "'Georgia', serif" }}>
              {product.title}
            </h3>
            <p className="text-[9px] text-black/35 uppercase tracking-[0.25em] mt-1 font-semibold">
              {product.brand}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            {product.originalPrice && (
              <p className="text-[9px] text-black/30 line-through leading-none mb-0.5">
                ₱{product.originalPrice.toLocaleString()}
              </p>
            )}
            <span className={`text-[12px] font-black leading-none ${product.discount ? "text-[#c8a96e]" : "text-[#111]"}`}>
              ₱{product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Color swatches + label */}
        {product.variants && (
          <div className="flex items-center gap-2 pt-0.5">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onMouseEnter={() => setSelectedVariant(variant)}
                title={variant.colorName}
                className="relative flex-shrink-0 transition-transform duration-200 hover:scale-110"
              >
                {/* Outer ring for selected state */}
                <span
                  className={`absolute inset-[-3px] rounded-full border transition-all duration-200 ${
                    selectedVariant.colorName === variant.colorName
                      ? "border-[#111] opacity-100"
                      : "border-transparent opacity-0"
                  }`}
                />
                <span
                  className="block w-3.5 h-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: variant.colorHex }}
                />
              </button>
            ))}

            {/* Color label */}
            <span className="text-[8px] text-black/35 uppercase tracking-[0.25em] ml-1 font-medium">
              {selectedVariant.colorName}
            </span>
          </div>
        )}

        {/* Bottom accent line — reveals on hover */}
        <motion.div
          className="h-px bg-[#c8a96e]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  );
};

export default ProductCard;