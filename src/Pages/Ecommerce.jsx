import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chbot from "../assets/chbot.png";
import chacce from "../assets/chacce.png";

const Ecommerce = ({ addToCart, selectedCategory }) => {
  const [addedMessage, setAddedMessage] = useState(null);

  const products = [
    {
      id: 1,
      title: "Trouser",
      desc: "Black cotton tee with a soft, comfortable fit.",
      color: "Black Trouser",
      category: "MEN",
      price: 135,
      img: chbot,
    },
    {
      id: 2,
      title: "Sling Bag",
      desc: "Gray sling bag with multiple compartments.",
      color: "Gray",
      category: "WOMEN",
      price: 55,
      img: chacce,
    },
    {
      id: 3,
      title: "Basic Tee",
      desc: "Charcoal gray tee with premium feel.",
      color: "Charcoal",
      category: "MEN",
      price: 35,
      img: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    },
    {
      id: 4,
      title: "Artwork Tee",
      desc: "Peach tee with geometric cube design.",
      color: "Iso Dots",
      category: "COLLECTIONS",
      price: 35,
      img: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    },
  ];

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedMessage(`${product.title} added to your cart!`);
    setTimeout(() => setAddedMessage(null), 2000);
  };

  return (
    <div className="relative py-16 px-4 md:px-10 bg-gray-50 min-h-screen">
      {/* ✅ Add-to-Cart Notification */}
      <AnimatePresence>
        {addedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {addedMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛍 Product Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full sm:w-[90%] md:w-[70%] lg:w-[45%] bg-gray-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* 🖼 Product Image */}
              <div className="md:w-1/2">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 📄 Product Info */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h2 className="text-3xl text-white font-bold mb-2">
                  {product.title}
                </h2>
                <p className="text-white mb-3">{product.desc}</p>
                <p className="text-white mb-2">
                  Color:{" "}
                  <span className="font-semibold text-white">
                    {product.color}
                  </span>
                </p>
                <p className="text-2xl text-white font-bold mb-6">
                  ${product.price}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-3 bg-black text-white text-lg rounded-xl hover:bg-red-600 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && ( 
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products found for this category.
        </p>
      )}
    </div>
  );
};

export default Ecommerce;
