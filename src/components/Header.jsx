import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, Menu, X, ChevronRight, LogOut } from "lucide-react";
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

function Header({
  cartItems = [],
  openCartModal,
  openShop,
  refreshPage,
  handleSearch
}) {

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

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=000&color=fff`;
  
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

          <div
            onClick={refreshPage}
            className="cursor-pointer transition-transform active:scale-95"
          >
            <img src={logo} alt="Logo" className="h-10 md:h-14" />
          </div>


          {/* NAV */}

          <nav className="hidden lg:flex font-black space-x-10">

            {["Men", "Women", "Kids", "Shoes", "Sale"].map((item) => (
              <button
                key={item}
                onMouseEnter={() => setActiveDropdown(item)}
                onClick={() => {
                  openShop("All", item, "All");
                  setActiveDropdown(null);
                }}
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

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:scale-110 transition"
              >
                <Search size={20} />
              </button>

            </div>


            {/* USER */}

            {user ? (

              <div className="relative hidden sm:block">

                <img
                  src={avatarSrc}
                  alt="avatar"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full cursor-pointer border border-white/20"
                />

                <AnimatePresence>

                  {profileOpen && (

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-48 bg-black border border-white/10 rounded-xl shadow-xl"
                    >

                      <button
                        onClick={() => navigate("/account")}
                        className="block w-full text-left px-4 py-3 hover:bg-white/10"
                      >
                        My Account
                      </button>

                      <button
                        onClick={() => navigate("/orders")}
                        className="block w-full text-left px-4 py-3 hover:bg-white/10"
                      >
                        Orders
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-red-400 hover:bg-white/10"
                      >
                        <LogOut size={16} /> Logout
                      </button>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            ) : (

              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block hover:scale-110 transition"
              >
                <User size={20} />
              </button>

            )}


            {/* CART */}

            <div
              className="relative cursor-pointer hover:scale-110 transition"
              onClick={openCartModal}
            >

              <ShoppingCart size={20} />

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}

            </div>


            {/* MOBILE MENU */}

            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

          </div>
        </div>

      </header>

    </>
  );
}

export default Header;

