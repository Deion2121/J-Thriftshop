import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/flogo.png";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  const categories = ["MEN", "WOMEN", "COLLECTIONS", "BRANDS", "SALE"];
  const dropdownItems = {
  MEN: [
    {
      title: "READY TO WEAR",
      items: ["JACKETS", "SHIRTS", "PANTS", "SUITS", "T-SHIRTS", "COATS"],
    },
    {
      title: "SHOES",
      items: ["BOOTS", "SNEAKERS", "LOAFERS", "SANDALS"],
    },
    {
      title: "ACCESSORIES",
      items: ["BELTS", "BAGS", "HATS", "JEWELRY"],
    },
  ],
  WOMEN: [
    {
      title: "READY TO WEAR",
      items: ["DRESSES", "TOPS", "SKIRTS", "PANTS", "COATS"],
    },
    {
      title: "SHOES",
      items: ["HEELS", "BOOTS", "SNEAKERS", "FLATS"],
    },
    {
      title: "HANDBAGS",
      items: ["TOTES", "CLUTCHES", "MINI BAGS", "SHOULDER BAGS"],
    },
  ],
  COLLECTIONS: [
    {
      title: "FEATURED",
      items: [
        "NEW ARRIVALS",
        "LIMITED EDITIONS",
        "COLLABORATIONS",
        "ICONIC STYLES",
      ],
    },
  ],
  BRANDS: [
    {
      title: "TOP BRANDS",
      items: ["CARHARTT", "NIKE", "NEW BALANCE", "ADIDAS", "VANS", "SKECHERS"],
    },
  ],
  SALE: [
    {
      title: "SALE",
      items: ["UP TO 50% OFF", "LAST CHANCE", "OUTLET ITEMS"],
    },
  ],
};


  // 🎯 Fade-on-scroll header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between py-3 px-6 lg:px-12 font-sans tracking-widest uppercase">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="w-24 object-contain invert transition-opacity duration-500"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-base lg:text-lg font-semibold text-white">
          {categories.map((cat) => (
            <div
              key={cat}
              className="relative group flex flex-row"
              
              onMouseEnter={() => setActiveDropdown(cat)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`transition-colors ${
                  cat === "SALE"
                    ? "text-red-600 hover:text-red-700"
                    : "hover:text-red-600"
                }`}
              >
                {cat}
              </button>

              {/* Dropdown */}
    <AnimatePresence>
  {activeDropdown === cat && (
    <motion.div
      initial={{ opacity: 0, y: -15, scale: 0.97, height: 0 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: "60px",
        width: "100svh",
        transition: {
          duration: 0,
          ease: [0.25, 0.1, 0.25, 1], // smooth cubic-bezier curve
        },
      }}
      exit={{
        opacity: 0,
        y: -10,
        scale: 0.97,
        height: 0,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      className="absolute top-full left-1/2 -translate-x-1/2 w-2 mt-6 z-100 "
    >
      {/* Inner luxury box */}
      <motion.div
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        className="backdrop-blur-2xl bg-white/60 border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.1)] px-14 py-10 grid grid-cols-2 sm:grid-cols-3 gap-10 text-gray-900 uppercase tracking-widest text-[13px] leading-relaxed"
      >
        {dropdownItems[cat].map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold text-[13px] mb-3 tracking-wide">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="cursor-pointer text-gray-700 hover:text-black transition-colors duration-500"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


            </div>
          ))}
        </nav>
        {/* Right Icons */}
        <div className="flex items-center space-x-5 text-white">
          <Search className="w-5 h-5 hover:text-red-600 cursor-pointer" />
          <Heart className="w-5 h-5 hover:text-red-600 cursor-pointer" />
          <User className="w-5 h-5 hover:text-red-600 cursor-pointer" />
          <div className="relative cursor-pointer">
            <ShoppingCart className="w-5 h-5 hover:text-red-600" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              1
            </span>
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
