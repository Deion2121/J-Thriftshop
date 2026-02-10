import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/flogo.png";

const brands = ["Nike", "Adidas", "Polo RL", "Vans", "Converse", "Puma", "Tommy Hilfiger", "New Balance", "Reebok", "Fila", "Uniqlo", "Champion", "Carhartt", "Guess"];

// 1. Inilabas ang data para sa performance at para maiwasan ang declaration errors
const MASTER_CATEGORY_DATA = {
  Men: {
    Nike: {
      Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
      Shoes: ["Lifestyle", "Running", "Jordan", "Football", "Basketball", "Skateboarding", "Slides", "Sandals"],
      Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
    },
    Adidas: {
      Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
      Footwear: ["Ultraboost", "Stan Smith", "Superstar", "NMD", "Yeezy", "Adilette Slides", "Forum", "Samba", "Gazelle"],
      Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
    },
    "Polo RL": {
      Clothing: ["T-Shirts", "Leather Jackets", "Shorts", "Pants", "Jackets", "Hoodies", "Polos", "Jeans"],
      Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
    },
      Vans: {
        Shoes: ["Old Skool", "Authentic", "Slip-On", "Sk8-Hi", "Era", "Style 36", "Classic T-Shirt", "Checkerboard Collection"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Converse:{
        Shoes: ["Chuck Taylor All Star", "One Star", "Jack Purcell", "Run Star Hike", "Converse Pro Leather", "Converse Weapon"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Puma:{
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Footwear: ["Suede Classic", "RS-X", "Cali", "Future Rider", "Roma", "LQD Cell", "Puma Clyde"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      "Tommy Hilfiger": {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      "New Balance": {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Footwear: ["574", "990v5", "1080v11", "Fresh Foam Hierro v6", "FuelCell Rebel v2", "Made in UK 991"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Reebok: {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Footwear: ["Classic Leather", "Club C 85", "Nano X1", "Zig Kinetica", "Reebok Question Mid"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Fila: {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Footwear: ["Disruptor II", "Ray Tracer", "Original Tennis", "F13", "Mindblower"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Uniqlo: {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Champion: {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Carhartt: {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      },
      Guess: {
        Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
        Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
      }
  },
  Women: {
    Nike: {
      Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
      Shoes: ["Lifestyle", "Running", "Jordan", "Football", "Basketball", "Skateboarding", "Slides", "Sandals"],
      Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
    },
    Adidas: {
      Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits", "Polos", "Sweatshirts", "Tank Tops", "Jeans"],
      Footwear: ["Ultraboost", "Stan Smith", "Superstar", "NMD", "Yeezy", "Adilette Slides", "Forum", "Samba", "Gazelle"],
      Accessories: ["Bags", "Caps and Hats", "Wallets", "Belts", "Sunglasses", "Watches", "Scarves", "Socks"]
    }
  },
  Kids: {
    Nike: {
      Clothing: ["T-Shirts", "Hoodies", "Shorts", "Pants", "Jackets", "Tracksuits"],
      Shoes: ["Lifestyle", "Running", "Jordan"]
    }
  },
  Shoes: {
    "New Arrival": ["Nike Air Max 2024", "Adidas Ultraboost 22", "Puma Future Rider"],
    "Best Sellers": ["Nike Air Force 1", "Adidas Stan Smith", "Puma Suede Classic"],
    "Limited Edition": ["Nike Dunk Low 'University Red'", "Adidas Yeezy Boost 350 V2 'Zebra'"]
  }
};

function Header({ cartItems = [], openCartModal, openShop, refreshPage, handleSearch }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeBrand, setActiveBrand] = useState("Nike");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // 2. Control Header Visibility on Scroll
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 border-b
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled || activeDropdown 
          ? "bg-black border-white/10" 
          : "bg-black md:bg-transparent border-transparent" 
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          
          {/* LOGO */}
          <div onClick={refreshPage} className="cursor-pointer shrink-0 transition-transform active:scale-95">
            <img src={logo} alt="Logo" className="h-10 md:h-14 w-auto object-contain" />
          </div>

          {/* MAIN NAV */}
          <nav className="hidden md:flex space-x-10">
            {["Men", "Women", "Kids", "Shoes", "Sale"].map((item) => (
              <button
                key={item}
                onMouseEnter={() => setActiveDropdown(item)}
                onClick={() => {
                  openShop("All", item, "All");
                  setActiveDropdown(null);
                }}
                className="relative text-[11px] font-black uppercase tracking-[0.3em] text-white group"
              >
                {item}
                <span className={`absolute left-0 -bottom-2 h-0.5 bg-white transition-all duration-300 ${activeDropdown === item ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-5 text-white">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "200px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="SEARCH BRAND..."
                    className="bg-white/10 border-b border-white/30 text-[10px] px-3 py-1 outline-none mr-3 uppercase tracking-widest"
                    autoFocus
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                )}
              </AnimatePresence>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:opacity-60 transition">
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>

            <button className="hidden sm:block hover:opacity-60 transition"><User size={20} /></button>

            <div className="relative cursor-pointer hover:opacity-60 transition" onClick={openCartModal}>
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {/* MEGA MENU */}
      <AnimatePresence>
        {activeDropdown && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-80 backdrop-blur-sm"
              onMouseEnter={() => setActiveDropdown(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-x-0 top-0 z-90 bg-black border-b border-white/10 pt-28 pb-16 hidden md:block shadow-2xl"
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="max-w-7xl mx-auto px-10 flex gap-16 text-white h-[55vh]">
                
                <div className="w-56 border-r border-white/10 space-y-4 overflow-y-auto pr-6 custom-scrollbar">
                  <h3 className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-6 font-black">Brands</h3>
                  {brands.map((brand) => (
                    <p
                      key={brand}
                      onMouseEnter={() => setActiveBrand(brand)}
                      onClick={() => {
                         openShop(brand, activeDropdown, "All");
                         setActiveDropdown(null);
                      }}
                      className={`cursor-pointer uppercase text-[12px] tracking-[0.2em] transition-all ${
                        activeBrand === brand ? "text-white font-black translate-x-3" : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {brand}
                    </p>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="flex justify-between items-baseline mb-10">
                    <h3 className="text-[10px] tracking-[0.4em] text-gray-500 uppercase font-black">
                      {activeBrand} <span className="mx-2 text-white/20">/</span> {activeDropdown}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-x-12 gap-y-12">
                    {(() => {
                      const currentCatData = MASTER_CATEGORY_DATA[activeDropdown];
                      const displayData = currentCatData?.[activeBrand] || currentCatData;

                      if (displayData && typeof displayData === 'object' && !Array.isArray(displayData)) {
                        return Object.entries(displayData).map(([section, items]) => (
                          <div key={section} className="space-y-6">
                            <h4 className="uppercase text-[11px] font-black text-white border-b border-white/10 pb-3 tracking-[0.2em]">
                              {section}
                            </h4>
                            <ul className="space-y-4">
                              {Array.isArray(items) && items.map((sub) => (
                                <li
                                  key={sub}
                                  className="text-gray-500 text-[13px] font-medium cursor-pointer hover:text-white hover:translate-x-2 transition-all duration-300"
                                  onClick={() => {
                                    openShop(activeBrand, activeDropdown, sub);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  {sub}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ));
                      }
                      return <div className="text-gray-600 uppercase text-[10px] tracking-widest">Select a valid category</div>;
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;