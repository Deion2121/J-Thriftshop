import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, Menu, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/flogo.png";

const brands = [
  "Nike", "Adidas", "Polo RL", "Vans", "Converse", "Puma",
  "Tommy Hilfiger", "New Balance", "Reebok", "Fila",
  "Uniqlo", "Champion", "Carhartt", "Guess"
];

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
    Clothing: ["T-Shirts", "Sets", "Jackets", "Pants"],
    Shoes: ["Lifestyle", "Running", "Sandals"]
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const controlHeader = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
        setActiveDropdown(null);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
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

  const avatarSrc = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=000&color=fff`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${isScrolled || activeDropdown ? "bg-black border-white/10 py-2" : "bg-transparent border-transparent py-4"}`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          
          {/* LOGO */}
          <div onClick={refreshPage} className="cursor-pointer transition-transform active:scale-95">
            <img src={logo} alt="Logo" className="h-10 md:h-14" />
          </div>

          {/* NAV */}
          <nav className="hidden lg:flex font-black space-x-10">
            {Object.keys(MASTER_CATEGORY_DATA).map((item) => (
              <button
                key={item}
                onMouseEnter={() => setActiveDropdown(item)}
                className="relative text-[11px] uppercase tracking-[0.3em] text-white group py-4"
              >
                {item}
                <span className={`absolute left-0 bottom-2 h-0.5 bg-white transition-all 
                ${activeDropdown === item ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6 text-white">
            {/* SEARCH */}
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
                      className="bg-transparent w-full text-[10px] outline-none uppercase tracking-widest"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:scale-110 transition">
                <Search size={20} />
              </button>
            </div>

            {/* USER PROFILE */}
            <div className="relative hidden sm:block">
              <img
                src={avatarSrc}
                alt="avatar"
                onClick={() => user ? setProfileOpen(!profileOpen) : navigate("/login")}
                className="w-8 h-8 rounded-full cursor-pointer border border-white/20"
              />
              <AnimatePresence>
                {user && profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-48 bg-black border border-white/10 rounded-xl shadow-xl overflow-hidden"
                  >
                    <button onClick={() => navigate("/account")} className="block w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-white/10">My Account</button>
                    <button onClick={() => navigate("/orders")} className="block w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-white/10">Orders</button>
                    <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 w-full px-4 py-3 text-xs uppercase tracking-widest text-red-400 hover:bg-white/10 border-t border-white/5">
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART */}
            <div className="relative cursor-pointer hover:scale-110 transition" onClick={openCartModal}>
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>

            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* --- FUNCTIONAL DROPDOWN (MEGA MENU) --- */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-black border-b border-white/10 shadow-2xl overflow-hidden"
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-8">
                {Object.entries(MASTER_CATEGORY_DATA[activeDropdown]).map(([category, subItems]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-white text-[12px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {subItems.map((sub) => (
                        <li key={sub}>
                          <button
                            onClick={() => {
                              openShop(activeDropdown, category, sub);
                              setActiveDropdown(null);
                            }}
                            className="text-white/50 hover:text-white text-[11px] uppercase tracking-widest transition-colors flex items-center group"
                          >
                            <ChevronRight size={10} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Optional "Shop All" or featured image section */}
                <div className="bg-white/5 rounded-2xl p-6 flex flex-col justify-between border border-white/5">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-2">Featured</p>
                    <h4 className="text-white font-black text-xl leading-tight">NEW SEASON ARRIVALS</h4>
                  </div>
                  <button 
                    onClick={() => { openShop("All", activeDropdown, "All"); setActiveDropdown(null); }}
                    className="bg-white text-black text-[10px] font-black py-3 rounded-full hover:bg-gray-200 transition uppercase tracking-widest"
                  >
                    View Everything
                  </button>
                </div>
              </div>

              {/* Brands bar at the bottom of the dropdown */}
              <div className="bg-white/[0.02] border-t border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-8 flex items-center space-x-8 overflow-x-auto no-scrollbar">
                  <span className="text-white/30 text-[9px] uppercase tracking-[0.3em] whitespace-nowrap">Top Brands:</span>
                  {brands.slice(0, 8).map(brand => (
                    <button 
                      key={brand}
                      className="text-white/50 hover:text-white text-[9px] uppercase tracking-widest transition"
                      onClick={() => { openShop("All", "All", brand); setActiveDropdown(null); }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;