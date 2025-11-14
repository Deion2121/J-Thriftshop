import React, { useState } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ecommerce from "./Pages/Ecommerce";
import Footer from "./components/Footer";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);

  const productsList = [
    {
      id: 1,
      title: "Trouser",
      desc: "Black cotton tee with a soft, comfortable fit.",
      category: "Men",
      color: "Black Trouser",
      price: 135,
      img: "/assets/chbot.png",
    },
    {
      id: 2,
      title: "Sling Bag",
      desc: "Gray sling bag with multiple compartments.",
      category: "Accessories",
      color: "Gray",
      price: 55,
      img: "/assets/chacce.png",
    },
    {
      id: 3,
      title: "Basic Tee",
      desc: "Charcoal gray tee with premium feel.",
      category: "Men",
      color: "Charcoal",
      price: 35,
      img: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    },
    {
      id: 4,
      title: "Artwork Tee",
      desc: "Peach tee with geometric cube design.",
      category: "Women",
      color: "Iso Dots",
      price: 35,
      img: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    },
  ];

  const [filters, setFilters] = useState({ category: "All", price: "All" });

  const filteredProducts = productsList.filter((product) => {
    let categoryMatch =
      filters.category === "All" || product.category === filters.category;
    let priceMatch = true;
    if (filters.price === "Under $50") priceMatch = product.price < 50;
    else if (filters.price === "$50 - $100")
      priceMatch = product.price >= 50 && product.price <= 100;
    else if (filters.price === "Over $100") priceMatch = product.price > 100;

    return categoryMatch && priceMatch;
  });

  // Add to Cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
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
      />

      <Hero openShop={() => setShopOpen(true)} />

   {shopOpen && (
  <div
    className="fixed inset-0 z-50 flex bg-black/50"
    onClick={() => setShopOpen(false)}
  >
    {/* SIDEBAR NAV LIKE IMAGE */}
    <div
      className="w-[320px] md:w-[360px] bg-white h-full shadow-2xl overflow-y-auto animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* SEARCH BAR */}
      <div className="p-4 border-b">
        <div className="flex items-center border rounded-full px-3 py-2">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z"
            />
          </svg>
        </div>
      </div>

      {/* MEN / WOMEN TABS */}
      <div className="flex border-b text-sm">
        {["Men", "Women"].map((cat) => (
          <button
            key={cat}
            className={`flex-1 py-3 text-center ${
              filters.category === cat
                ? "font-semibold border-b-2 border-black"
                : "text-gray-500 bg-gray-200"
            }`}
            onClick={() =>
              setFilters((prev) => ({ ...prev, category: cat }))
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CATEGORY LIST */}
      <div className="p-4 space-y-4 text-sm">
        <button className="block text-left">New Arrivals</button>
        <button className="block text-left text-red-500">Sale</button>

        <button className="block text-left items-center gap-1">
          Holiday Gift Sets 🎁
        </button>

        <button className="block text-left">Essentials</button>
        <button className="block text-left">Dress Code</button>
        <button className="block text-left">Denim</button>

        <button className="block text-left  items-center gap-1">
          Crew 🧸
        </button>

        {/* DROPDOWNS */}
        {[
          "Shop by Collection",
          "Tops",
          "Bottoms",
          "Innerwear",
          "Footwear",
          "Accessories",
          "Personal Care",
        ].map((title, index) => (
          <div key={index}>
            <button
              className="w-full flex justify-between items-center"
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === title ? null : title
                )
              }
            >
              {title}
              <span className="text-lg">
                {activeDropdown === title ? "▲" : "▼"}
              </span>
            </button>

            {activeDropdown === title && (
              <div className="pl-4 mt-2 space-y-2 text-gray-600">
                <p>Item 1</p>
                <p>Item 2</p>
                <p>Item 3</p>
              </div>
            )}
          </div>
        ))}

        <button className="block text-left">All Items</button>
      </div>

      {/* FOOTER LINKS */}
      <div className="border-t mt-6 p-4 space-y-3 text-sm text-gray-700">
        
        <p>Buy Online, Pick-up in Store</p>
        <p>JThriftShop</p>
        <p>Return Exchange</p>
      </div>

      {/* SOCIAL ICONS */}
      <div className="p-4 flex gap-5 text-xl">
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-x-twitter"></i>
        <i className="fa-brands fa-tiktok"></i>
      </div>
    </div>

    {/* PRODUCT GRID */}
    <div
      className="flex-1 bg-gray-50 px-6 py-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      onClick={(e) => e.stopPropagation()}
    >
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <Ecommerce
            key={product.id}
            addToCart={() => addToCart(product)}
          />
        ))
      ) : (
        <p className="text-gray-700 text-lg col-span-full text-center mt-10">
          No products match your filters.
        </p>
      )}
    </div>
  </div>
)}
      {/* Default Ecommerce (main page) */}
      <Ecommerce
        addToCart={addToCart}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveDropdown={setActiveDropdown}
      />

      <Footer />
    </>
  );
}

export default App;
