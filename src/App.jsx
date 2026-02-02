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
  const [fromShopNow, setFromShopNow] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    subCategory: "All",
    price: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const openShop = (main, category, sub = null) => {
    const isShopNow = !main;
    setFromShopNow(isShopNow);
    setFilters({
      category: main || "All",
      subCategory: sub || "All",
      price: "All",
    });
    setShopOpen(true);
  };

  const categoryData = {
    New: {
       Featured: ["Latest Arrivals", "Trending Now", "Limited Edition"],
       Categories: ["Shirts", "Pants", "Jackets", "Accessories"],
       Collections: ["Urban Wear", "Sports", "Essentials"],
    },
    Men: {
      Clothing: ["T-Shirts", "Hoodies", "Jackets", "Jeans"],
      Accessories: ["Bags", "Caps", "Socks"],
    },
    Women: {
      Clothing: ["Dresses", "Tops", "Leggings"],
      Bags: ["Handbags", "Backpacks"],
    },
    Kids: {
      Clothing: ["Shirts", "Shorts"],
    },
    Accessories: {
      Bags: ["Backpacks", "Crossbody", "Tote Bags"],
      Gadgets: ["Headphones", "Chargers"],
      Misc: ["Caps", "Socks", "Wallets"],
    },
    Shoes: {
      "Men's Shoes": ["Running", "Lifestyle", "Training"],
      "Women's Shoes": ["Running", "Lifestyle"],
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
    setCartModalOpen(true);
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

      <Hero openShop={openShop} />

      {/* Shop Sidebar Overlay */}
      {shopOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/50"
          onClick={() => setShopOpen(false)}
        >
          <div className="flex h-full w-full">
            {/* Sidebar Filters */}
            <div
              className="w-80 md:w-96 lg:w-[400px] bg-white h-full shadow-2xl overflow-y-auto animate-slideIn relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
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
                  {fromShopNow ? "ALL" : `${filters.category} • ${filters.subCategory}`}
                </h2>

                {fromShopNow
                  ? Object.entries(categoryData).map(([main, sections]) => (
                      <div key={main}>
                        <h3 className="font-bold mt-4 mb-2">{main}</h3>

                        {Object.entries(sections).map(([section, items]) => (
                          <FilterAccordion
                            key={section}
                            title={section}
                            items={items}
                            selected={filters.subCategory}
                            onSelect={(sub) => {
                              setFromShopNow(false);
                              setFilters({
                                category: main,
                                subCategory: sub,
                                price: "All",
                              });
                            }}
                          />
                        ))}
                      </div>
                    ))
                  : categoryData[filters.category] &&
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
            <div className="flex-1 bg-gray-50 p-6 py-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {filters.category === "Shoes" ? (
                // Card layout for Shoes category
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => addToCart(product)}
                      >
                        {/* Product Image Container */}
                        <div className="relative bg-gray-100 aspect-square flex items-center justify-center p-8">
                          <img
                            src={product.img}
                            alt={product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-4 space-y-1">
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${product.price}
                            </span>
                          </div>

                          {/* Product Title */}
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.title}
                          </h3>

                          {/* Category */}
                          <p className="text-xs text-gray-600">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              ) : (
                // Original layout for other categories
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    <p className="col-span-full text-center text-gray-500">No products found</p>
                  )}
                </div>
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
      className="bg-white w-full max-w-4xl mx-4 rounded-lg relative flex flex-col md:flex-row max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl z-10"
        onClick={() => setCartModalOpen(false)}
      >
        ✕
      </button>

      {/* Left side - Cart Items */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">CART</h2>
        
        {cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-6 border-b border-gray-200"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-base mb-1">{item.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-600">
                      <span>{item.color || 'Black'}</span>
                      <span>|</span>
                      <span>{item.size || 'Large'}</span>
                    </div>
                    <p className="text-base font-medium mt-2">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 text-sm">
                    {item.inStock !== false ? (
                      <>
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-green-600">In stock</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-500">Ships in 3-4 weeks</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity and Remove */}
                <div className="flex flex-col items-end justify-between">
                  {/* Quantity Selector */}
                  <select
                    value={item.quantity || 1}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Item</p>
        )}
      </div>

      {/* Right side - Order Summary */}
      <div className="w-full md:w-96 bg-gray-50 p-8 rounded-r-lg">
        <h3 className="text-lg font-semibold mb-6">Order summary</h3>

        <div className="space-y-4 mb-6">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              ${cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Shipping estimate</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">$5.00</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm pb-4 border-b border-gray-300">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Tax estimate</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">$8.32</span>
          </div>

          {/* Total */}
          <div className="flex justify-between text-base font-medium pt-2">
            <span>Order total</span>
            <span>
              ${(
                cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) +
                5.00 +
                8.32
              ).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Checkout
        </button>
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