import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Siguraduhing imported ito
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ecommerce from "./Pages/Ecommerce";
import LogoSlider from "./Slider/LogoSlider";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import FilterSidebar from "./components/FilterSidebar";

// Asset Imports
import chhood from "./assets/chhood.png";
import chtop from "./assets/chtop.png";
import chsand from "./assets/chsand.png";
import chbot from "./assets/chbot.png";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isShopView, setIsShopView] = useState(false);

  const [filters, setFilters] = useState({
    brand: "All",
    category: "All",
    subCategory: "All",
    size: null, 
    sort: "Newest"
  });

  // Loader Effect - Pinapagana ang transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  // Products Data
  const [allProducts] = useState([
    { id: 1, title: "Artwork Tee", brand: "Carhartt", category: "Women", subCategory: "Tops", price: 3500, img: chtop },
    { id: 2, title: "Urban Sling Bag", brand: "Carhartt", category: "Women", subCategory: "Accessories", price: 1200, img: chsand },
    { id: 3, title: "Nike Heritage Jordan", brand: "Nike", category: "Men", subCategory: "T-Shirts", price: 1800, img: chtop },
    { id: 4, title: "Artwork Tee", brand: "Carhartt", category: "Women", subCategory: "Tops", price: 3500, img: chtop },
    { id: 5, title: "Urban Sling Bag", brand: "Carhartt", category: "Women", subCategory: "Accessories", price: 1200, img: chsand },
    { id: 6, title: "Nike Heritage Jordan", brand: "Nike", category: "Men", subCategory: "T-Shirts", price: 1800, img: chtop },
    { id: 7, title: "Artwork Tee", brand: "Carhartt", category: "Women", subCategory: "Tops", price: 3500, img: chtop },
    { id: 8, title: "Urban Sling Bag", brand: "Carhartt", category: "Women", subCategory: "Accessories", price: 1200, img: chsand },
    { id: 9, title: "Nike Heritage Jordan", brand: "Nike", category: "Men", subCategory: "T-Shirts", price: 1800, img: chtop },
    { id: 10, title: "Artwork Tee", brand: "Carhartt", category: "Women", subCategory: "Tops", price: 3500, img: chtop },
  ]);

  // Logic Functions
  const handleSearch = (query) => {
    setSearchTerm(query);
    setIsShopView(true);
  };

  const openShop = (brand, category, sub = "All") => {
    setFilters({ brand, category, subCategory: sub, size: null, sort: "Newest" });
    setSearchTerm("");
    setIsShopView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setIsShopView(false);
    setSearchTerm("");
    setFilters({ brand: "All", category: "All", subCategory: "All", size: null, sort: "Newest" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refreshPage = () => { window.location.href = "/"; };

  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filters.brand === "All" || p.brand === filters.brand;
    const matchesCat = filters.category === "All" || p.category === filters.category;
    return matchesSearch && matchesBrand && matchesCat;
  });

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartModalOpen(true);
  };

  return (
    <>
      {/* 1. Loader Logic with Exit Animation */}
      <AnimatePresence>
  {isLoading && (
    <Loader key="main-loader" finishLoading={() => setIsLoading(false)} />
  )}
</AnimatePresence>

      {/* 2. Main Content Wrapper - Lalabas lang kapag tapos na ang loading */}
      {!isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col min-h-screen bg-white text-black"
        > 
          <Header
            cartItems={cartItems}
            openCartModal={() => setCartModalOpen(true)}
            openShop={openShop}
            handleSearch={handleSearch}
            refreshPage={refreshPage}
          />  

          <div className="grow">
            {!isShopView ? (
              <>
                <Hero openShop={() => openShop("All", "All")} />
                <Ecommerce addToCart={addToCart} filters={filters} />
                <LogoSlider />
              </>
            ) : (
              <main className="pt-32 pb-20">
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                  <button 
                    onClick={goHome}
                    className="group mb-8 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] hover:text-gray-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Home
                  </button>

                  <h1 className="text-2xl font-black uppercase mb-2 tracking-tighter">
                    {searchTerm ? `Results for: ${searchTerm}` : filters.brand !== "All" ? `${filters.brand} ${filters.category}` : "All Products"}
                  </h1>
                  <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-widest">
                    [{filteredProducts.length}] Items Found
                  </p>

                  <ProductGrid 
                    products={filteredProducts} 
                    filters={filters} 
                    onOpenFilters={() => setShopOpen(true)} 
                    addToCart={addToCart}
                  />
                </div>
              </main>
            )}
          </div>

          <Footer />
        </motion.div>
      )}

      {/* 3. Sidebar (Outside the wrapper to prevent clipping issues) */}
      <FilterSidebar 
        isOpen={shopOpen} 
        onClose={() => setShopOpen(false)} 
        filters={filters}
        setFilters={setFilters} 
        allProducts={allProducts} 
      />
    </>
  );
}

export default App;