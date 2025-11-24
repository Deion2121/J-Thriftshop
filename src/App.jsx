import React, { useState } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ecommerce from "./Pages/Ecommerce";
import LogoSlider from "./Slider/LogoSlider";
import Footer from "./components/Footer";
import chhood from "./assets/chhood.png";
import chtop from "./assets/chtop.png";
import chsand from "./assets/chsand.png";
import chbot from "./assets/chbot.png";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [filters, setFilters] = useState({ category: "All", price: "All" });

  const productsList = [
    { id: 1, title: "Trouser", category: "Men", price: 135 , img: chbot },
    { id: 2, title: "Sling Bag", category: "Accessories", price: 55, img: chsand },
    { id: 3, title: "Basic Tee", category: "Men", price: 35, img: chhood },
    { id: 4, title: "Artwork Tee", category: "Women", price: 35, img: chtop },
  ];

  const filteredProducts = productsList.filter((product) => {
    const categoryMatch = filters.category === "All" || product.category === filters.category;
    let priceMatch = true;
    if (filters.price === "Under $50") priceMatch = product.price < 50;
    else if (filters.price === "$50 - $100") priceMatch = product.price >= 50 && product.price <= 100;
    else if (filters.price === "Over $100") priceMatch = product.price > 100;
    return categoryMatch && priceMatch;
  });

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    alert(`Proceeding to checkout. Total amount: $${total}`);
  };

  return (
    <>
      <Loader />

      <Header
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        openCartModal={handleCheckout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        openShop={() => setShopOpen(true)}
      />

      <Hero openShop={() => setShopOpen(true)} />

      {/* Shop Sidebar Overlay */}
      {shopOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/50"
          onClick={() => setShopOpen(false)}
        >
          {/* Sidebar Container */}
          <div className="flex h-full w-full">
            {/* Sidebar */}
            <div
              className="w-80 md:w-96 lg:w-[400px] bg-white h-full shadow-2xl overflow-y-auto animate-slideIn relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShopOpen(false);
                  window.scrollTo({ top: 0 });
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black text-white text-2xl flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all duration-200"
              >
                ✕
              </button>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="flex items-center border rounded-full px-3 py-2">
                  <input type="text" placeholder="Search" className="flex-1 outline-none text-sm" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z" />
                  </svg>
                </div>
              </div>

              {/* Category Buttons */}
              <div className="flex border-b text-sm">
                {["Men", "Women"].map((cat) => (
                  <button
                    key={cat}
                    className={`flex-1 py-3 text-center ${
                      filters.category === cat
                        ? "font-semibold border-b-2 border-black"
                        : "text-gray-500 bg-gray-200"
                    }`}
                    onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Additional Buttons */}
              <div className="p-4 space-y-4 text-sm" onClick={() => setFilters({ category: "All", price: "All" })}>
                <button className="block text-left">New Arrivals</button>
                <button className="block text-left text-red-500">Sale</button>
                <button className="block text-left items-center gap-1">Holiday Gift Sets 🎁</button>
                <button className="block text-left">Essentials</button>
                <button className="block text-left">Dress Code</button>
                <button className="block text-left">Denim</button>
                <button className="block text-left items-center gap-1">Crew 🧸</button>
              </div>

              {/* Info */}
              <div className="border-t mt-6 p-4 space-y-3 text-sm text-gray-700">
                <p>Buy Online, Pick-up in Store</p>
                <p>Shipping nationwide</p>
              </div>

              {/* Social Icons */}
              <div className="p-4 flex gap-5 text-xl">
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-tiktok"></i>
              </div>
            </div>

            {/* Responsive Product Grid */}
            <div
              className="flex-1 bg-gray-50 px-6 py-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative overflow-hidden rounded-2xl cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl aspect-square"
                    onClick={() => addToCart(product)}
                  >
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-700 text-lg col-span-full text-center mt-10">
                  No products match your filters.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Components */}
      <Ecommerce
        addToCart={addToCart}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveDropdown={setActiveDropdown}
      />
      <LogoSlider />
      <Footer />
    </>
  );
}

export default App;
