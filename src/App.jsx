import React, { useState, useMemo } from "react";
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
import tops from "./assets/chtop.png";
import sandals from "./assets/chsand.png";
import pants from "./assets/chbot.png";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [filters, setFilters] = useState({
  category: "All",
  subCategory: "All",
  price: "All",
});  const [searchTerm, setSearchTerm] = useState("");

 const subCategoryMap = {
    Men: ["Trouser", "Basic Tee", "Jeans", "Hoodie"],
    Women: ["Artwork Tee", "Summer Dress"],
    Kids: ["Shirts", "Clogs", "Pants"],
  };


const productsList = [
    { id: 1, title: "Trouser", category: "Men", price: 135 , img: chbot },
    { id: 2, title: "Sling Bag", category: "Accessories", price: 55, img: chsand },
    { id: 3, title: "Basic Tee", category: "Men", price: 35, img: chhood },
    { id: 4, title: "Artwork Tee", category: "Women", price: 35, img: chtop },
    { id: 5, title: "Jeans", category: "Men", price: 80, img: chbot },
    { id: 6, title: "Handbag", category: "Accessories", price: 120, img: chsand },
    { id: 7, title: "Summer Dress", category: "Women", price: 70, img: chtop },
    { id: 8, title: "Hoodie", category: "Men", price: 60, img: chhood },
    { id: 9, title: "Shirts", category: "Kids", price: 50, img: tops},
    { id: 10, title: "Clogs", category: "Kids", price: 40, img: sandals},
    { id: 11, title: "Pants", category: "Kids", price: 40, img: pants},
  ];

 const filteredProducts = useMemo(() => {
  return productsList.filter((product) => {
    const categoryMatch =
      filters.category === "All" ||
      product.category === filters.category;

    const subCategoryMatch =
      filters.subCategory === "All" ||
      product.title
        .toLowerCase()
        .includes(filters.subCategory.toLowerCase());

    const priceMatch =
      filters.price === "All" ||
      (filters.price === "Under $50" && product.price < 50) ||
      (filters.price === "$50 - $100" &&
        product.price >= 50 &&
        product.price <= 100) ||
      (filters.price === "Over $100" && product.price > 100);

    const searchMatch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      categoryMatch &&
      subCategoryMatch &&
      priceMatch &&
      searchMatch
    );
  });
}, [productsList, filters, searchTerm]);

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
        openShop={(category = "All", subCategory = "All") => {
            setFilters((prev) => ({
              ...prev,
              category,
              subCategory,
            }));
            setShopOpen(true);
}}     
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

                {/* Browsing Header */}
                <div className="px-4 py-3 border-b sticky top-0 bg-white z-10">
                  <p className="text-xs text-gray-400 uppercase">Browsing</p>
                  <h2 className="text-lg font-semibold">
                    {filters.category}
                    {filters.subCategory !== "All" && ` • ${filters.subCategory}`}
                  </h2>
                </div>
              {/* Close Button */}
              <button
                onClick={() => {
                  setShopOpen(false);
                  window.scrollTo({ top: 0 });
                }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-black text-white text-2xl flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all duration-200"
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z" />
                  </svg>
                </div>
              </div>

              {/* Category Buttons */}
                  <div className="flex border-b text-sm">
                      {["All", "Men", "Women", "Kids"].map((cat) => (
                        <button
                          key={cat}
                          className={`flex-1 py-3 text-center transition-colors ${
                            filters.category === cat
                              ? "font-semibold border-b-2 border-black text-black"
                              : "text-gray-500 hover:text-black"
                          }`}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              category: cat,
                              subCategory: "All", // reset sub-category when changing main category
                            }))
                          }
                        >
                          {cat}
                        </button>
                      ))}
                    </div>{/* Sub Category Filter */}
{filters.category !== "All" && subCategoryMap[filters.category] && (
  <div className="p-4 border-b">
    <p className="text-xs uppercase text-gray-400 mb-3">
      Filter by
    </p>

    <div className="flex flex-wrap gap-2">
      <button
        className={`px-4 py-2 rounded-full text-sm border transition ${
          filters.subCategory === "All"
            ? "bg-black text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            subCategory: "All",
          }))
        }
      >
        All
      </button>

      {subCategoryMap[filters.category].map((sub) => (
        <button
          key={sub}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            filters.subCategory === sub
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              subCategory: sub,
            }))
          }
        >
          {sub}
        </button>
      ))}
    </div>
  </div>
)}
                            
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
                  className="flex-1 bg-gray-50 p-6 py-8 overflow-x-scroll 
                            grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="
                          relative flex justify-center items-center
                          w-[250px] h-[250px] 
                          2xl:w-[350px] 2xl:h-[450px]
                          overflow-hidden rounded-2xl 
                          cursor-pointer transform transition duration-300 
                          hover:scale-105 hover:shadow-2xl
                        "
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
