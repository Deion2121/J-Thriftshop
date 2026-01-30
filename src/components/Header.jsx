import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Loader,
} from "lucide-react";
import logo from "../assets/flogo.png";

const menuData = {
  New: {
    Featured: ["Latest Arrivals", "Trending Now", "Limited Edition"],
    Categories: ["Shirts", "Pants", "Jackets", "Accessories"],
    Collections: ["Urban Wear", "Sports", "Essentials"],
  },
  Men: {
    Topwear: ["T-Shirts", "Shirts", "Jackets"],
    Bottomwear: ["Jeans", "Shorts", "Joggers"],
    Footwear: ["Sneakers", "Running Shoes"],
  },
  Women: {
    Topwear: ["Blouses", "Crop Tops", "Jackets"],
    Bottomwear: ["Leggings", "Jeans", "Shorts"],
    Footwear: ["Heels", "Flats", "Slides"],
  },
  Kids: {
    Boys: ["Tops", "Shorts", "Sets"],
    Girls: ["Dresses", "Tops", "Leggings"],
    Baby: ["Newborn Sets", "Rompers"],
  },
  Accessories: {
    Bags: ["Backpacks", "Crossbody", "Tote Bags"],
    Gadgets: ["Headphones", "Chargers"],
    Misc: ["Caps", "Socks", "Wallets"],
  },
  Shoes: {
    "Men’s Shoes": ["Running", "Lifestyle", "Training"],
    "Women’s Shoes": ["Running", "Lifestyle"],
    "Kids Shoes": ["Sneakers", "Slip-ons"],
  },
  Collection: {
    Seasonal: ["Winter", "Summer", "Spring"],
    Special: ["Limited Ed.", "Collabs"],
  },
  Sale: {
    Categories: ["Up to 30%", "30–50%", "Clearance"],
  },
};

function Header({ cartItems = [], openCartModal, openShop, categoryData }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const [scrollUp, setScrollUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  /* header bg on scroll */
  useEffect(() => {
    const onScroll = () => setScrolling(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll direction detection */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current < lastScrollY && current > 80) {
        setScrollUp(false);
      } else {
        setScrollUp(false);
        setActiveDropdown(null);
      }

      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* auto-open on scroll up */
  useEffect(() => {
    if (scrollUp && !activeDropdown) {
      setActiveDropdown("New");
    }
  }, [scrollUp, activeDropdown]);

  /* lock body on mobile menu */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          activeDropdown
            ? "bg-black/40 backdrop-blur-xl"
            : scrolling
            ? "bg-black"
            : "bg-transparent"
        }`}
      >
        <div className="absolute w-full grid grid-cols-3 items-center py-6 px-6">
          {/* LOGO */}
          <img src={logo} alt="Logo" className="w-20 invert" />
          

          {/* DESKTOP MENU */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <nav className="flex space-x-10">
              {Object.keys(menuData).map((item) => (
                <button
                  key={item}
                  onMouseEnter={() => setActiveDropdown(item)}
                  className="relative text-lg font-medium text-white group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-white transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>
          </div>

          {/* ICONS */}
          <div className="flex justify-self-end items-center space-x-5 text-white">
            <Search className="w-5 h-5 cursor-pointer" />
            <Heart className="w-5 h-5 cursor-pointer" />
            <User className="hidden md:block cursor-pointer" />
            <div className="relative">
              <ShoppingCart onClick={openCartModal} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
            </div>
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* DESKTOP MEGA MENU */}
     <AnimatePresence>
  {activeDropdown && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xl"
      onMouseEnter={() => setActiveDropdown(activeDropdown)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="pt-32 max-w-7xl mx-auto px-10 text-white">
        <h3 className="text-xl font-semibold uppercase mb-10">
          {activeDropdown}
        </h3>

       <div className="grid grid-cols-4 gap-10">
  {categoryData?.[activeDropdown] &&
    Object.entries(categoryData[activeDropdown]).map(
      ([section, items]) => (
        <div key={section}>
          <h4 className="uppercase text-gray-400 mb-4">
            {section}
          </h4>

          {items.map((sub) => (
            <p
              key={sub}
              className="cursor-pointer hover:text-white"
              onClick={() => {
                openShop(activeDropdown, sub);
                setActiveDropdown(null);
              }}
            >
              {sub}
            </p>
          ))}
        </div>
      )
    )}
</div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* MOBILE MENU */}
     <AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-0 bg-black z-40 p-6 md:hidden"
    >
      <div className="mt-20 space-y-6">
        {Object.entries(menuData).map(([menu, sections]) => (
          <div key={menu}>
            {/* Main category button */}
            <button
              className="flex justify-between w-full text-white font-semibold"
              onClick={() =>
                setMobileDropdown(mobileDropdown === menu ? null : menu)
              }
            >
              {menu}
              <ChevronDown
                className={`transition ${
                  mobileDropdown === menu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Submenu items */}
            {mobileDropdown === menu && (
              <div className="mt-2 pl-4 space-y-2">
                {Object.entries(sections).map(([section, items]) => (
                  <div key={section}>
                    <h4 className="text-sm text-gray-400 uppercase mb-1">
                      {section}
                    </h4>
                    {items.map((sub) => (
                      <p
                        key={sub}
                        className="text-white py-1 cursor-pointer hover:text-gray-300 transition"
                        onClick={() => {
                          if (openShop) {
                            openShop(menu, sub); // 🔥 connects mobile click to shop
                          }
                          setMobileMenuOpen(false); // close mobile menu
                          setMobileDropdown(null);  // reset dropdown state
                        }}
                      >
                        {sub}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}

export default Header;
