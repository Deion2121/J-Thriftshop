import React, { useState, useMemo } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ecommerce from "./Pages/Ecommerce";
import LogoSlider from "./Slider/LogoSlider";
import Footer from "./components/Footer";
import FilterAccordion from "./components/FilterAccordion";

import chhood from "./assets/chhood.png";
import chtop from "./assets/chtop.png";
import chsand from "./assets/chsand.png";
import chbot from "./assets/chbot.png";
import tops from "./assets/chtop.png";
import sandals from "./assets/chsand.png";
import pants from "./assets/chbot.png";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "Men",
    subCategory: "All",
    price: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const categoryData = {
    Men: {
      Clothing: ["T-Shirts", "Hoodies", "Jackets", "Jeans"],
      Shoes: ["Running", "Basketball", "Lifestyle"],
      Accessories: ["Bags", "Caps", "Socks"],
    },
    Women: {
      Clothing: ["Dresses", "Tops", "Leggings"],
      Shoes: ["Heels", "Sneakers"],
      Bags: ["Handbags", "Backpacks"],
    },
    Kids: {
      Clothing: ["Shirts", "Shorts"],
      Shoes: ["Sandals", "Sneakers"],
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

  const productsList = [
    { id: 1, title: "Trouser", category: "Men", price: 135, img: chbot },
    { id: 2, title: "Sling Bag", category: "Accessories", price: 55, img: chsand },
    { id: 3, title: "Basic Tee", category: "Men", price: 35, img: chhood },
    { id: 4, title: "Artwork Tee", category: "Women", price: 35, img: chtop },
    { id: 5, title: "Jeans", category: "Men", price: 80, img: chbot },
    { id: 6, title: "Handbag", category: "Accessories", price: 120, img: chsand },
    { id: 7, title: "Summer Dress", category: "Women", price: 70, img: chtop },
    { id: 8, title: "Hoodie", category: "Men", price: 60, img: chhood },
    { id: 9, title: "Shirts", category: "Kids", price: 50, img: tops },
    { id: 10, title: "Clogs", category: "Kids", price: 40, img: sandals },
    { id: 11, title: "Pants", category: "Kids", price: 40, img: pants },
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const categoryMatch =
        filters.category === "All" || product.category === filters.category;

      const subCategoryMatch =
        filters.subCategory === "All" ||
        product.title.toLowerCase().includes(filters.subCategory.toLowerCase());

      const priceMatch =
        filters.price === "All" ||
        (filters.price === "Under $50" && product.price < 50) ||
        (filters.price === "$50 - $100" &&
          product.price >= 50 &&
          product.price <= 100) ||
        (filters.price === "Over $100" && product.price > 100);

      const searchMatch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return categoryMatch && subCategoryMatch && priceMatch && searchMatch;
    });
  }, [filters, searchTerm]);

  // Add to Cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartModalOpen(true); // Open cart modal when product added
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
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
        openCartModal={() => setCartModalOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        openShop={openShop}
        categoryData={categoryData}
      />

      <Hero openShop={() => setShopOpen(true)} />

      {/* Shop Sidebar Overlay */}
      {shopOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/50"
          onClick={() => setShopOpen(false)}
        >
          <div className="flex h-full w-full">
            <div
              className="w-80 md:w-96 lg:w-[400px] bg-white h-full shadow-2xl overflow-y-auto animate-slideIn relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setShopOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all duration-200"
              >
                ✕
              </button>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="flex items-center border rounded-full px-3 py-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

              {/* Filters */}
              <div className="p-4 space-y-4">
                <h2 className="font-semibold text-lg mb-4">
                  {filters.category}
                  {filters.subCategory !== "All" && ` • ${filters.subCategory}`}
                </h2>

                {categoryData[filters.category] &&
                  Object.entries(categoryData[filters.category]).map(
                    ([section, items]) => (
                      <FilterAccordion
                        key={section}
                        title={section}
                        items={items}
                        selected={filters.subCategory}
                        onSelect={(sub) =>
                          setFilters((prev) => ({ ...prev, subCategory: sub }))
                        }
                      />
                    )
                  )}
              </div>
            </div>

            {/* Product Grid */}
            <div
              className="flex-1 bg-gray-50 p-6 py-8 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex justify-center items-center w-[250px] h-[250px] 2xl:w-[350px] 2xl:h-[450px] overflow-hidden rounded-2xl cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => addToCart(product)}
                  >
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {cartModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setCartModalOpen(false)}
        >
          <div
            className="bg-white w-96 max-w-full p-6 rounded-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            {cartItems.length > 0 ? (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span>
                        {item.title} x {item.quantity || 1}
                      </span>
                      <span>${item.price * (item.quantity || 1)}</span>
                      <button
                        className="text-red-500 ml-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>
                    $
                    {cartItems.reduce(
                      (sum, item) => sum + item.price * (item.quantity || 1),
                      0
                    )}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Checkout
                </button>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}

            <button
              className="absolute top-3 right-3 text-xl font-bold"
              onClick={() => setCartModalOpen(false)}
            >
              ✕
            </button>
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

  // Open Shop helper
  function openShop(category = "All", subCategory = "All") {
    setFilters((prev) => ({ ...prev, category, subCategory }));
    setShopOpen(true);
  }
}

export default App;
