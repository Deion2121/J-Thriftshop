import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/flogo.png";

const Header = ({ cartItems = [], removeFromCart, openCartModal }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const categories = ["MEN", "WOMEN", "COLLECTIONS", "BRANDS", "SALE"];

  const dropdownItems = {
    MEN: [
      { title: "TOPS", items: ["SHIRTS", "TEES", "JACKETS", "POLO", "HOODIES"] },
      { title: "BOTTOMS", items: ["PANTS", "SHORTS", "JEANS", "CHINOS"] },
      { title: "FOOTWEAR", items: ["SNEAKERS", "SLIDES", "SANDALS"] },
    ],
    WOMEN: [
      { title: "TOPS", items: ["DRESSES", "BLOUSES", "TEES", "TANKTOPS"] },
      { title: "BOTTOMS", items: ["SKIRTS", "JEANS", "PANTS", "SHORTS"] },
      { title: "FOOTWEAR", items: ["HEELS", "SNEAKERS", "FLATS"] },
    ],
    COLLECTIONS: [
      { title: "FEATURED", items: ["NEW ARRIVALS", "LIMITED", "SEASONAL"] },
    ],
    BRANDS: [
      { title: "TOP BRANDS", items: ["BENCH", "ADIDAS", "NIKE"] },
    ],
    SALE: [
      { title: "DISCOUNTS", items: ["UP TO 50%", "CLEARANCE"] },
    ],
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between py-4 px-6 lg:px-12">
          {/* LOGO */}
          <a href="#" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-28 object-contain invert"
            />
          </a>

          {/* NAV - DESKTOP */}
          <nav className="hidden md:flex items-center space-x-10 text-white text-[15px] tracking-wide font-semibold uppercase">
            {categories.map((cat) => (
              <div
                key={cat}
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`transition-all ${
                    cat === "SALE"
                      ? "text-red-600 hover:text-red-700"
                      : "hover:text-red-600"
                  }`}
                >
                  {cat}
                </button>

                {/* Mega Dropdown */}
               <AnimatePresence>
  {activeDropdown === cat && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}

      className="
        fixed 
        left-0 
        top-64px  
        w-full 
        z-999

        /* WHITE BACKGROUND (SOLID) */
        bg-white 

        /* Clean border (YSL-style hairline) */
        border-t border-black/10
        
        /* Spacing */
        py-14 
        px-24

        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
      "

      onMouseEnter={() => setActiveDropdown(cat)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* TOP SOFT GRADIENT (VERY LIGHT FOR DEPTH) */}
      <div 
        className="
          absolute top-0 left-0 w-full h-10 
          bg-linear-to-b from-white to-white/70 
          pointer-events-none
        " 
      />

      {/* GRID CONTENT */}
      <div className="grid grid-cols-12 gap-14 text-black uppercase tracking-wide">

        {/* SECTION TITLES */}
        <div className="col-span-3 space-y-4 text-[14px] font-semibold text-black">
          {dropdownItems[cat].map((section, i) => (
            <p 
              key={i}
              className="cursor-pointer hover:text-gray-700"
            >
              {section.title}
            </p>
          ))}
        </div>

        {/* ITEMS LIST */}
        <div className="col-span-3 space-y-3 text-[13px] text-black/80">
          {dropdownItems[cat][0]?.items?.map((item, i) => (
            <p 
              key={i} 
              className="cursor-pointer hover:text-black"
            >
              {item}
            </p>
          ))}
        </div>

        {/* IMAGE GRID */}
        <div className="col-span-6 grid grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((img, i) => (
            <div
              key={i}
              className="
                relative overflow-hidden 
                rounded-xl shadow-md 
                group cursor-pointer
                bg-white
              "
            >
              <img
                src={`/megadrop/${img}.jpg`}
                className="
                  w-full 
                  h-48 
                  object-cover 
                  transition-transform 
                  duration-500 
                  group-hover:scale-105
                "
              />
              <div className="absolute bottom-4 left-4 text-black text-xs font-bold tracking-wide">
                STYLE {i + 1}
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  )}
</AnimatePresence>
              </div>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-5 text-white">
            {/* SEARCH */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="border px-4 py-1 rounded w-64 text-black focus:outline-none"
              />
              <Search className="absolute right-3 top-2 w-4 h-4 text-gray-500" />
            </div>

            {/* FAVORITES */}
            <Heart className="w-5 h-5 hover:text-red-600 cursor-pointer" />

            {/* USER */}
            <User className="w-5 h-5 hover:text-red-600 cursor-pointer" />

            {/* CART */}
            <div
              className="relative cursor-pointer"
              onClick={openCartModal}
            >
              <ShoppingCart className="w-5 h-5 hover:text-red-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* MOBILE MENU */}
            <button className="md:hidden" onClick={() => setMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/70 z-999"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="w-3/4 h-full bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="mb-6 text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              <ul className="space-y-6 text-gray-800 font-semibold text-lg uppercase">
                {categories.map((cat) => (
                  <li key={cat} className="hover:text-red-600 cursor-pointer">
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
