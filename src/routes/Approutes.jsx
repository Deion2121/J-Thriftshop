// src/routes/AppRoutes.jsx
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

// API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [productError, setProductError] = useState(null);
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
    sort: "Newest",
  });

  // -----------------------------
  // FETCH PRODUCTS (SAFE)
  // -----------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setProductError(null);

      try {
        const res = await axios.get(`${API_URL}/products`);
        console.log("Product API response:", res.data);

        let productsArray = [];

        // Handle different backend response formats
        if (Array.isArray(res.data)) {
          productsArray = res.data; // array directly
        } else if (res.data && Array.isArray(res.data.data)) {
          productsArray = res.data.data; // wrapped in data
        } else if (res.data && typeof res.data === "object") {
          productsArray = [res.data]; // single object
        } else {
          productsArray = []; // fallback empty
        }

        const formatted = productsArray.map((p) => ({
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
              image: p.image || "",
            },
          ],
        }));

        setAllProducts(formatted);
      } catch (err) {
        console.error("Product fetch error:", err);
        setProductError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // -----------------------------
  // LOADER
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // -----------------------------
  // SHOP FUNCTIONS
  // -----------------------------
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
      sort: "Newest",
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

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartModalOpen(true);
  };

  // -----------------------------
  // FILTERED PRODUCTS
  // -----------------------------
  const filteredProducts = allProducts.filter((p) => {
    const search =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const brand = filters.brand === "All" || p.brand === filters.brand;
    const cat = filters.category === "All" || p.category === filters.category;
      filters.subCategory === "All" || p.subCategory === filters.subCategory;
    return search && brand && cat && sub;
  });

  // -----------------------------
  // SHOP LAYOUT
  // -----------------------------
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
                {searchTerm ? `Results for: ${searchTerm}` : "All Products"}
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

  // -----------------------------
  // RENDER
  // -----------------------------
  if (isLoading) return <Loader finishLoading={() => setIsLoading(false)} />;

  if (productError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 font-bold">{productError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col min-h-screen bg-white text-black"
      >
        <Routes>
           {/*Login */}
          <Route path="/login" element={<Login />} />
          
           {/*Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/*PUBLIC */}
          <Route path="/" element={<ShopLayout />} />
        </Routes>

      </motion.div>
    </AnimatePresence>
  );
}

export default AppRoutes;