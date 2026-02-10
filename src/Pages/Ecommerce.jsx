import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chhood from "../assets/chhood.png";
import s from "../assets/s.png";
import nb from "../assets/nb.png";

const Ecommerce = ({ addToCart, filters }) => {
  const [addedMessage, setAddedMessage] = useState(null);

  // Ang Ecommerce ngayon ay magpapakita lang ng "Top Picks" o "Featured"
  // Hindi na ito dapat makipag-agawan sa main search filter.
  const featuredProducts = [
    { id: 101, title: "Premium Trouser", price: 135, img: chhood, category: "MEN" },
    { id: 102, title: "Urban Sling Bag", price: 55, img: s, category: "WOMEN" },
    { id: 103, title: "Classic Basic Tee", price: 35, img: nb, category: "MEN" },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedMessage(`${product.title} added!`);
    setTimeout(() => setAddedMessage(null), 2000);
  };

  // KUNG ang user ay namimili na sa ProductGrid (may category na pinili),
  // itatago natin itong Ecommerce component para hindi magulo.
  if (filters.category !== "All" || filters.subCategory !== "All") {
    return null; 
  }

  return (
    <div className="py-16 px-4 md:px-10 bg-white">
      {/* Notification */}
      <AnimatePresence>
        {addedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold uppercase text-xs"
          >
            {addedMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Must-Haves</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Selected for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="bg-[#f5f5f5] aspect-4/5 overflow-hidden relative">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 right-4 bg-white p-3 shadow-md hover:bg-black hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <h3 className="font-bold uppercase text-sm tracking-tight">{product.title}</h3>
                <p className="text-gray-600 font-bold">₱{product.price.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;