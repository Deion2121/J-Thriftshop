import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import chbot from "../assets/chbot.png";
import chtop from "../assets/chtop.png";
import chhood from "../assets/chhood.png";
import chshoe from "../assets/chshoe.png";

// 🧥 Product Card (Polo Aesthetic)
const ProductCard = ({ title, desc, price, imgSrc, onClick }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
    className="cursor-pointer"
    onClick={onClick}
  >
    <div className="overflow-hidden bg-[#f9f9f9] rounded-sm">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-[430px] object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
    <div className="mt-5 text-center">
      <h3 className="font-serif uppercase tracking-wide text-lg text-[#0b2545]">
        {title}
      </h3>
      <p className="text-sm text-gray-500 italic">{desc}</p>
      <p className="mt-1 text-[#0b2545] font-medium">₱{price}</p>
    </div>
  </motion.div>
);

// 🛒 Product Drawer (Ralph Lauren luxury style)
const ProductDrawer = ({ product, onClose }) => (
  <AnimatePresence>
    {product && (
      <>
        {/* Luxury blurred background overlay */}
        <motion.div
          className="fixed inset-0 backdrop-blur-sm bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Right slide drawer */}
        <motion.div
          className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-2xl overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center border-b p-6 bg-[#0b2545] text-white">
            <h2 className="text-lg font-serif uppercase tracking-widest">
              {product.title}
            </h2>
            <button onClick={onClose}>
              <X size={22} className="hover:opacity-80" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <img
              src={product.imgSrc}
              alt={product.title}
              className="w-full h-[360px] object-cover rounded-sm"
            />
            <p className="text-gray-700 leading-relaxed">{product.desc}</p>
            <p className="text-xl font-semibold text-[#0b2545]">
              ₱{product.price}
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <label className="text-sm font-semibold text-gray-700">
                Select Size
              </label>
              <select className="border p-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0b2545]">
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>

              <button className="mt-4 bg-[#0b2545] text-white px-6 py-3 uppercase tracking-wide hover:bg-[#081b33] transition-all duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// 💛 Category Bar
const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ["All", "Men", "Women", "Accessories"];

  return (
    <div className="sticky top-0 bg-white z-30 flex flex-wrap justify-center gap-10 mt-2 mb-10 py-4 border-b border-gray-200 shadow-sm backdrop-blur-md">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`uppercase text-sm tracking-widest transition-all duration-300 ${
            selectedCategory === cat
              ? "text-[#0b2545] border-b-2 border-[#0b2545]"
              : "text-gray-500 hover:text-[#0b2545]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

// 🏬 Main Ecommerce Section
const Ecommerce = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { title: "Polo Shirt", desc: "Classic fit cotton pique", price: 3899, imgSrc: chtop, category: "Men" },
    { title: "Chino Pants", desc: "Tailored modern cut", price: 3499, imgSrc: chbot, category: "Men" },
    { title: "Cable-Knit Sweater", desc: "Soft wool blend", price: 4599, imgSrc: chhood, category: "Women" },
    { title: "Leather Loafers", desc: "Italian craftsmanship", price: 5899, imgSrc: chshoe, category: "Women" },
    { title: "Silk Scarf", desc: "Elegant gold print", price: 2299, imgSrc: chshoe, category: "Accessories" },
    { title: "Canvas Tote", desc: "Polo signature print", price: 2699, imgSrc: chhood, category: "Accessories" },
  ];

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* 🧭 Sticky Filter Bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* 🛍️ Animated Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
          >
            {filtered.map((item, index) => (
              <ProductCard
                key={index}
                {...item}
                onClick={() => setSelectedProduct(item)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🧾 Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default Ecommerce;
