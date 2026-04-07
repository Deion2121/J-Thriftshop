import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, Menu, LogOut, Shield, X } from "lucide-react";
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
  const { currentUser, logout } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const isAdmin = currentUser?.role === "admin";

  const avatarSrc =
    currentUser?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      currentUser?.name || (isAdmin ? "Admin" : "User")
    )}&background=111&color=fff`;

  useEffect(() => {
    const controlHeader = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
        setActiveDropdown(null);
        setProfileOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const executeSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
  };

  const cartCount = cartItems.length;

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="fixed top-0 left-0 w-full z-[101] bg-[#c8a96e] text-black text-center py-2 text-[9px] tracking-[0.35em] uppercase font-bold">
        Free Shipping on Orders Over ₱999 &nbsp;·&nbsp; New Arrivals Every Week
      </div>

      {/* ── MAIN HEADER ── */}
      <header
        className={`fixed left-0 w-full z-[100] transition-all duration-500
          ${isVisible ? "translate-y-[32px]" : "-translate-y-full"}
          ${isScrolled || activeDropdown
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06] py-0"
            : "bg-transparent border-b border-transparent py-0"
          }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">

          {/* LOGO */}
          <button
            onClick={refreshPage}
            className="flex-shrink-0 transition-opacity hover:opacity-70 duration-300"
          >
            <img src={logo} alt="Logo" className="h-9 md:h-11" />
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {Object.keys(MASTER_CATEGORY_DATA).map((item) => (
              <button
                key={item}
                onMouseEnter={() => setActiveDropdown(item)}
                className={`relative px-4 py-2 text-[10px] uppercase tracking-[0.28em] font-bold transition-colors duration-200
                  ${activeDropdown === item ? "text-[#c8a96e]" : "text-white/80 hover:text-white"}
                  ${item === "Sale" ? "!text-[#c8a96e]" : ""}
                `}
              >
                {item}
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-px bg-[#c8a96e] transition-transform duration-200 origin-left
                    ${activeDropdown === item ? "scale-x-100" : "scale-x-0"}`}
                />
              </button>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-5 text-white">

            {/* SEARCH TOGGLE */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white/70 hover:text-white transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>

            {/* USER */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => currentUser ? setProfileOpen(!profileOpen) : navigate("/login")}
                className="text-white/70 hover:text-white transition-colors duration-200"
                aria-label="Account"
              >
                {currentUser ? (
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-7 h-7 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <User size={18} strokeWidth={1.75} />
                )}
              </button>

              <AnimatePresence>
                {currentUser && profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-4 w-52 bg-[#111] border border-white/10 shadow-2xl overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/[0.07]">
                      <p className="text-white text-xs font-bold tracking-wide truncate">
                        {currentUser?.name || "My Account"}
                      </p>
                      <p className="text-white/40 text-[10px] tracking-wide truncate mt-0.5">
                        {currentUser?.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { navigate("/admin"); setProfileOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#c8a96e] hover:bg-white/5 transition-colors"
                      >
                        <Shield size={13} />
                        Admin Panel
                      </button>
                    )}

                    {[
                      { label: "My Account", path: "/account" },
                      { label: "Orders", path: "/orders" },
                    ].map(({ label, path }) => (
                      <button
                        key={path}
                        onClick={() => { navigate(path); setProfileOpen(false); }}
                        className="block w-full text-left px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {label}
                      </button>
                    ))}

                    <div className="border-t border-white/[0.07]">
                      <button
                        onClick={() => { logout(); navigate("/"); setProfileOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-red-400/80 hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={13} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART */}
            <button
              className="relative text-white/70 hover:text-white transition-colors duration-200"
              onClick={openCartModal}
              aria-label="Cart"
            >
              <ShoppingCart size={18} strokeWidth={1.75} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute -top-2 -right-2 bg-[#c8a96e] text-black text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="lg:hidden text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* ── MEGA DROPDOWN ── */}
        <AnimatePresence>
          {activeDropdown && MASTER_CATEGORY_DATA[activeDropdown] && (
            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-[#0a0a0a]/97 backdrop-blur-md border-b border-white/[0.06] hidden lg:block"
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
            >
              <div className="max-w-[1400px] mx-auto px-10 py-10">
                <div className="grid grid-cols-4 gap-10">
                  {Object.entries(MASTER_CATEGORY_DATA[activeDropdown]).map(([group, items]) => (
                    <div key={group}>
                      <p className="text-[9px] tracking-[0.4em] uppercase text-[#c8a96e] font-bold mb-4">
                        {group}
                      </p>
                      <ul className="space-y-2.5">
                        {items.map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                openShop(activeDropdown, item);
                                setActiveDropdown(null);
                              }}
                              className="text-white/50 text-[11px] tracking-wide hover:text-white transition-colors duration-150 uppercase"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Promo block */}
                  <div className="col-span-1 border border-white/[0.07] p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] tracking-[0.4em] uppercase text-[#c8a96e] font-bold mb-2">
                        Trending Now
                      </p>
                      <p className="text-white text-lg font-black uppercase italic leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                        New<br />Season<br />Drops
                      </p>
                    </div>
                    <button
                      onClick={() => { openShop(activeDropdown, null); setActiveDropdown(null); }}
                      className="self-start text-[9px] tracking-[0.3em] uppercase text-white/50 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SEARCH BAR ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-[#0a0a0a]/97 backdrop-blur-md border-b border-white/[0.06]"
            >
              <div className="max-w-[1400px] mx-auto px-10 py-6 flex items-center gap-4">
                <Search size={16} className="text-white/30 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={executeSearch}
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 bg-transparent text-white text-sm tracking-wide placeholder:text-white/20 outline-none"
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[110] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[300px] bg-[#0d0d0d] z-[120] lg:hidden flex flex-col overflow-y-auto"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
                <img src={logo} alt="Logo" className="h-9" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 px-2 py-4">
                {Object.keys(MASTER_CATEGORY_DATA).map((category) => (
                  <div key={category} className="border-b border-white/[0.05]">
                    <button
                      onClick={() =>
                        setMobileExpandedCategory(
                          mobileExpandedCategory === category ? null : category
                        )
                      }
                      className={`flex items-center justify-between w-full px-4 py-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-colors
                        ${category === "Sale" ? "text-[#c8a96e]" : "text-white/70 hover:text-white"}`}
                    >
                      {category}
                      <motion.span
                        animate={{ rotate: mobileExpandedCategory === category ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-white/30"
                      >
                        ›
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {mobileExpandedCategory === category && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          {Object.entries(MASTER_CATEGORY_DATA[category]).map(([group, items]) => (
                            <div key={group} className="px-4 pb-4">
                              <p className="text-[8px] tracking-[0.4em] uppercase text-[#c8a96e] font-bold mb-2 mt-2">
                                {group}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      openShop(category, item);
                                      setMobileMenuOpen(false);
                                    }}
                                    className="text-[10px] text-white/50 uppercase tracking-wide border border-white/10 px-3 py-1.5 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Mobile footer */}
              <div className="border-t border-white/[0.07] px-6 py-5 space-y-3">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={avatarSrc} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
                      <div>
                        <p className="text-white text-xs font-bold">{currentUser?.name}</p>
                        <p className="text-white/40 text-[10px]">{currentUser?.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <button onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 text-[#c8a96e] text-[10px] uppercase tracking-widest">
                        <Shield size={12} /> Admin Panel
                      </button>
                    )}
                    <button onClick={() => { navigate("/account"); setMobileMenuOpen(false); }}
                      className="block text-white/50 text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                      My Account
                    </button>
                    <button onClick={() => { navigate("/orders"); setMobileMenuOpen(false); }}
                      className="block text-white/50 text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                      Orders
                    </button>
                    <button onClick={() => { logout(); navigate("/"); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 text-red-400/70 text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors">
                      <LogOut size={12} /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                    className="w-full text-center border border-white/20 text-white/70 text-[10px] uppercase tracking-[0.25em] py-3 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;