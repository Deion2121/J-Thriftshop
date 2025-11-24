import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingCart, Menu, X, MousePointerClick } from "lucide-react";
import logo from "../assets/flogo.png";

const Header = ({
  cartItems = [],
  removeFromCart,
  openCartModal,
  sidebarOpen,
  setSidebarOpen,
  openShop,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolling, setScrolling] = useState(false);

  // Detect scroll for header background
  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolling ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-6 px-6 md:px-12">
        {/* Logo */}
        <a href="#" className="flex items-center" >
          <img src={logo} alt="Logo" className="w-20 object-contain invert" />
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-10 items-center">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <div
              key={item}
              onMouseEnter={() => setActiveDropdown(item)}
              onMouseLeave={() => setActiveDropdown(null)}
              className="relative"
            >
              <a
                href={`#${item.toLowerCase()}`}
                className={`transition-colors duration-200 text-white hover:text-gray-300 text-lg md:text-xl font-medium`}
              >
                {item}
              </a>
            </div>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6">
  <Search
    className="text-white cursor-pointer hover:text-gray-300 transition-transform duration-200 transform hover:scale-110"
    onClick={openShop}
  />
  <div
    className="w-px h-6 bg-white cursor-pointer"
    onClick={openShop}
  />
  <Heart className="text-white cursor-pointer hover:text-gray-300 transition-transform duration-200 transform hover:scale-110" />
  <User className="text-white cursor-pointer hover:text-gray-300 transition-transform duration-200 transform hover:scale-110" />
  <div className="relative">
    <ShoppingCart
      className="text-white cursor-pointer hover:text-gray-300 transition-transform duration-200 transform hover:scale-110"
      onClick={openCartModal}
    />
    {cartItems.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
        {cartItems.length}
      </span>
    )}
  </div>
</div>
      </div>
    </header>
  );
};

export default Header;
