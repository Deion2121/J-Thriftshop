import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import logo from "../assets/flogo.png";

const brands = ["Nike", "Adidas", "Polo RL", "Vans", "Converse", "Puma", "Tommy Hilfiger", "New Balance", "Reebok", "Fila", "Uniqlo", "Champion", "Carhartt", "Guess"];

const MASTER_CATEGORY_DATA = {
  Men: {
    Clothing: ["T-Shirts", "Hoodies", "Pants", "Jackets", "Tracksuits"],
    Shoes: ["Lifestyle", "Running", "Basketball", "Training"],
    Accessories: ["Bags", "Caps", "Socks", "Watches"]
  },
  Women: {
    Clothing: ["Tops", "Dresses", "Leggings", "Outerwear", "Skirts"],
    Shoes: ["Lifestyle", "Running", "Training", "Sandals"],
    Accessories: ["Handbags", "Jewelry", "Socks", "Headwear"]
  },
  Kids: {
    "Youth [8-16]": ["Boys Clothing", "Girls Clothing"], 
    "Kids [4-8]":["Boys Clothing", "Girls Clothing"],
    "Toddlers [0-4]": ["boys Clothing", "Girls Clothing"]
  },
  Shoes: {
    Categories: ["Lifestyle", "Running", "Basketball", "Training", "Football", "Skateboarding"],
    Brands: ["Nike", "Adidas", "New Balance", "Vans", "Converse"]
  },
  Sale: {
    Offers: ["Clearance", "Last Chance", "Seasonal Sale", "Flash Sale"],
    Discounts: ["20% Off", "30% Off", "50% Off"]
  }
};

function Header({ cartItems = [], openCartModal, openShop, refreshPage, handleSearch }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 20);
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
          setActiveDropdown(null);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  const executeSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-500 border-b
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled || activeDropdown 
          ? "bg-black border-white/10 py-2" 
          : "bg-transparent border-transparent py-4" 
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          
          <div onClick={refreshPage} className="cursor-pointer shrink-0 transition-transform active:scale-95">
            <img src={logo} alt="Logo" className="h-10 md:h-14 w-auto object-contain" />
          </div>

          <nav className="hidden lg:flex font-black space-x-10">
            {["Men", "Women", "Kids", "Shoes", "Sale"].map((item) => (
              <button
                key={item}
                onMouseEnter={() => setActiveDropdown(item)}
                onClick={() => {
                  openShop("All", item, "All");
                  setActiveDropdown(null);
                }}
                className="relative text-[11px] font-black uppercase tracking-[0.3em] text-white group py-4"
              >
                {item}
                <span className={`absolute left-0 bottom-2 h-0.5 bg-white transition-all duration-300 ${activeDropdown === item ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-6 text-white">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "240px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center bg-white/10 rounded-full px-4 py-1.5 border border-white/20 mr-2"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={executeSearch}
                      placeholder="SEARCH PRODUCTS..."
                      className="bg-transparent w-full text-[10px] outline-none uppercase tracking-widest placeholder:text-gray-500"
                      autoFocus
                    />
                    {searchQuery && <X size={12} className="cursor-pointer" onClick={() => setSearchQuery("")} />}
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:scale-110 transition active:scale-90">
                <Search size={20} />
              </button>
            </div>

            <button className="hidden sm:block hover:scale-110 transition active:scale-90">
              <User size={20} />
            </button>

            <div className="relative cursor-pointer hover:scale-110 transition active:scale-90" onClick={openCartModal}>
              <ShoppingCart size={20} />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={cartItems.length}
                    className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-xl"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <button className="lg:hidden hover:bg-white/10 p-2 rounded-full transition" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN */}
        <AnimatePresence>
          {activeDropdown && MASTER_CATEGORY_DATA[activeDropdown] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 w-full bg-black border-b border-white/10 py-12 hidden lg:block shadow-2xl"
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
            >
              <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-12">
                
                {/* Column 1: FEATURED BRANDS (Ngayon ay 2 Columns na) */}
<div className="space-y-6 col-span-1 border-r border-white pr-4">
  <h3 className="text-[10px] text-gray-500 font-black tracking-[0.4em] uppercase">Choose Brand</h3>
  
  {/* Ginamit natin ang grid-cols-2 dito */}
  <div className="grid grid-cols-1 gap-x-2 gap-y-3">
    {brands.map(brand => (
      <button 
        key={brand}
        onClick={() => { 
          openShop(brand, activeDropdown, "All"); 
          setActiveDropdown(null); 
        }}
        className="text-white text-[13px] font-black italic uppercase tracking-tighter text-left hover:text-gray-400 hover:translate-x-1 transition-all whitespace-nowrap"
      >
        {brand}
      </button>
    ))}
  </div>
</div>

                {/* Dynamic Columns from MASTER_DATA (Clothing, Shoes, etc.) */}
                {Object.entries(MASTER_CATEGORY_DATA[activeDropdown]).map(([subCat, items]) => (
                  <div key={subCat} className="space-y-6">
                    <h3 className="text-[10px] text-gray-500 font-black tracking-[0.4em] uppercase">{subCat}</h3>
                    <ul className="space-y-3">
                      {items.map(item => (
                        <li 
                          key={item}
                          onClick={() => { 
                            openShop("All", activeDropdown, item); 
                            setActiveDropdown(null); 
                          }}
                          className="text-white text-[11px] font-bold uppercase tracking-widest cursor-pointer hover:text-gray-400 transition-colors"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-[200] bg-black text-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8">
              {["Men", "Women", "Kids", "Shoes", "Sale"].map((item) => (
                <div 
                  key={item}
                  onClick={() => { openShop("All", item, "All"); setMobileMenuOpen(false); }}
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <span className="text-4xl font-black uppercase tracking-tighter italic">{item}</span>
                  <ChevronRight size={20} className="text-gray-500" />
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