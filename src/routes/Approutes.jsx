import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";

// Pages
import AdminDashboard from "../Pages/AdminDashboard";
import Login from "../Pages/Login";
import Ecommerce from "../Pages/Ecommerce";

// Components
import Loader from "../components/Loader";
import Header from "../components/Header";
import Hero from "../components/Hero";
import LogoSlider from "../Slider/LogoSlider";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import FilterSidebar from "../components/FilterSidebar";
import CartModal from "../components/CartModal";

// Protected Route
import AdminRoute from "./Adminroutes";

const API_URL = "http://localhost:3000/api/products";

function AppRoutes() {

  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShopView, setIsShopView] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const [filters, setFilters] = useState({
    brand: "All",
    category: "All",
    subCategory: "All",
    size: null,
    sort: "Newest"
  });

  // FETCH PRODUCTS
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(API_URL);

        const formatted = res.data.map(p => ({
          id: p.id,
          title: p.name || "Unnamed",
          brand: p.brand || "Unknown",
          category: p.category || "General",
          subCategory: p.subCategory || "General",
          price: Number(p.price) || 0,
          img: p.image || "",
          variants: [
            {
              colorName: "Default",
              colorHex: "#000",
              image: p.image || ""
            }
          ]
        }));

        setAllProducts(formatted);

      } catch (err) {

        console.error("Product fetch error:", err);

      }

    };

    fetchProducts();

  }, []);

  // LOADER
  useEffect(() => {

    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => clearTimeout(timer);

  }, []);

  // SEARCH
  const handleSearch = (query) => {

    setSearchTerm(query);
    setIsShopView(true);

  };

  const openShop = (brand = "All", category = "All", sub = "All") => {

    setFilters({
      brand,
      category,
      subCategory: sub,
      size: null,
      sort: "Newest"
    });

    setSearchTerm("");
    setIsShopView(true);

  };

  const goHome = () => {

    setIsShopView(false);
    setSearchTerm("");

  };

  const refreshPage = () => {
    window.location.href = "/";
  };

  // FILTER PRODUCTS
  const filteredProducts = allProducts.filter((p) => {

    const search =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const brand =
      filters.brand === "All" || p.brand === filters.brand;

    const cat =
      filters.category === "All" || p.category === filters.category;

    const sub =
      filters.subCategory === "All" || p.subCategory === filters.subCategory;

    return search && brand && cat && sub;

  });

  // CART
  const addToCart = (product) => {

    setCartItems(prev => {

      const exist = prev.find(i => i.id === product.id);

      if (exist) {

        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );

      }

      return [...prev, { ...product, quantity: 1 }];

    });

    setCartModalOpen(true);

  };

  // SHOP LAYOUT
  const ShopLayout = () => (

    <>
      <Header
        cartItems={cartItems}
        openCartModal={() => setCartModalOpen(true)}
        openShop={openShop}
        handleSearch={handleSearch}
        refreshPage={refreshPage}
      />

      <div className="grow relative">

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
                className="mb-8 text-xs font-bold uppercase"
              >
                ← Back to Home
              </button>

              <h1 className="text-2xl font-black uppercase mb-2">
                {searchTerm
                  ? `Results for: ${searchTerm}`
                  : "All Products"}
              </h1>

              <p className="text-xs text-gray-500 mb-8">
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

      <FilterSidebar
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        filters={filters}
        setFilters={setFilters}
        allProducts={allProducts}
      />

      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </>

  );

  if (isLoading) {
    return <Loader finishLoading={() => setIsLoading(false)} />;
  }

  return (

    <AnimatePresence mode="wait">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col min-h-screen bg-white text-black"
      >

        <Routes>

          <Route path="/login" element={<Login />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="/" element={<ShopLayout />} />

        </Routes>

      </motion.div>

    </AnimatePresence>

  );

}

export default AppRoutes;