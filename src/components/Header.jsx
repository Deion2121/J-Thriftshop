import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/flogo.png";

const Header = ({
  cartItems,
  removeFromCart,
  openCartModal,
  sidebarOpen, // 🧩 add prop
  setSidebarOpen, // 🧩 add prop
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeDropModal, setActiveDropModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const categories = ["MEN", "WOMEN", "COLLECTIONS", "BRANDS", "SALE"];
  const dropdownItems = {
    MEN: [
      { title: "READY TO WEAR", items: ["JACKETS", "SHIRTS", "PANTS", "SUITS", "T-SHIRTS", "COATS"] },
      { title: "SHOES", items: ["BOOTS", "SNEAKERS", "LOAFERS", "SANDALS"] },
      { title: "ACCESSORIES", items: ["BELTS", "BAGS", "HATS", "JEWELRY"] },
    ],
    WOMEN: [
      { title: "READY TO WEAR", items: ["DRESSES", "TOPS", "SKIRTS", "PANTS", "COATS"] },
      { title: "SHOES", items: ["HEELS", "BOOTS", "SNEAKERS", "FLATS"] },
      { title: "HANDBAGS", items: ["TOTES", "CLUTCHES", "MINI BAGS", "SHOULDER BAGS"] },
    ],
    COLLECTIONS: [{ title: "FEATURED", items: ["NEW ARRIVALS", "LIMITED EDITIONS", "COLLABORATIONS", "ICONIC STYLES"] }],
    BRANDS: [{ title: "TOP BRANDS", items: ["CARHARTT", "NIKE", "NEW BALANCE", "ADIDAS", "VANS", "SKECHERS"] }],
    SALE: [{ title: "SALE", items: ["UP TO 50% OFF", "LAST CHANCE", "OUTLET ITEMS"] }],
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns/modals when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      setActiveDropdown(null);
      setActiveDropModal(null);
    }
  }, [sidebarOpen]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    alert(`Email submitted: ${email}`);
    setActiveDropModal(null);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    alert(`Proceeding to checkout. Total: $${total}`);
    setActiveDropModal(null);
  };

  const toggleDropdown = (cat) => {
    if (sidebarOpen) return; // 🚫 Disable dropdowns while sidebar open
    setActiveDropdown(activeDropdown === cat ? null : cat);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setActiveDropModal(null);
    setSidebarOpen?.(false);
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between py-3 px-6 lg:px-12 font-sans tracking-widest uppercase">
          <a
            href="#"
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              setSidebarOpen?.((prev) => !prev); // 🧩 click logo toggles sidebar
              closeAll(); // 🧩 close header dropdowns when sidebar opens
            }}
          >
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
                onMouseEnter={() => toggleDropdown(cat)}
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
                        transition: { duration: 0, ease: [0.25, 0.1, 0.25, 1] },
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        scale: 0.97,
                        height: 0,
                        transition: { duration: 0.4, ease: "easeInOut" },
                      }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-6 z-100"
                    >
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
            <input
              type="text"
              placeholder="Explore"
              className="w-full border px-12 py-2 rounded"
            />
            <Heart
              className="w-8 h-5 hover:text-red-600 cursor-pointer"
              onClick={() => setActiveDropModal("favorites")}
            />
            <User
              className="w-8 h-5 hover:text-red-600 cursor-pointer"
              onClick={() => setActiveDropModal("Email")}
            />
            <div
              className="relative cursor-pointer"
              onClick={() => {
                setActiveDropModal("cart");
                openCartModal?.();
              }}
            >
              <ShoppingCart className="w-5 h-5 hover:text-red-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
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

      {/* MODALS */}
      <AnimatePresence>
        {activeDropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-999"
            onClick={closeAll} // 🧩 clicking outside closes all
          >
            <div
              className="bg-white text-black p-6 rounded-lg w-[90%] max-w-md relative"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <button
                onClick={() => setActiveDropModal(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              {activeDropModal === "favorites" && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Favorites</h2>
                  <p className="text-gray-500">You have no favorite items yet.</p>
                </div>
              )}

              {activeDropModal === "Email" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Subscribe / Login</h2>
                  <form onSubmit={handleEmailSubmit}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              )}

              {activeDropModal === "cart" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 border-b pb-3"
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-black text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">
                        Your cart is empty.
                      </p>
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <>
                      <div className="flex justify-between items-center font-semibold text-lg pt-3">
                        <span>Total:</span>
                        <span>
                          $
                          {cartItems.reduce(
                            (sum, item) =>
                              sum + item.price * (item.quantity || 1),
                            0
                          )}
                        </span>
                      </div>
                      <button
                        onClick={handleProceedToCheckout}
                        className="bg-black text-white mt-5 px-4 py-3 rounded-lg hover:bg-red-600 transition w-full text-sm tracking-wide uppercase"
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
