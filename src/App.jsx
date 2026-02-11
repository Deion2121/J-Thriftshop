import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ecommerce from "./Pages/Ecommerce";
import LogoSlider from "./Slider/LogoSlider";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import FilterSidebar from "./components/FilterSidebar";
import CartModal from "./components/CartModal"; // Siguraduhing may component ka nito

// Asset Imports
import chhood from "./assets/carhartt/chhood.png";
import chtop from "./assets/carhartt/chtop.png";
import niket from "./assets/nike/ntshirt.png";
import niket1 from "./assets/nike/ntshirt1.png";
import niket2 from "./assets/nike/ntshirt2.png";
import nkdunk from "./assets/nike/nikedunk.png";
import nkdunk1 from "./assets/nike/nikedunk1.png";
import nkdunk2 from "./assets/nike/nikedunk2.png";
import nkdunk3 from "./assets/nike/nikedunk3.png";
import nkdunk4 from "./assets/nike/nikedunk4.png";
import atshirt from "./assets/adidas/atshirtm.png";
import atshirt1 from "./assets/adidas/atshirtm1.png";
import atshirt2 from "./assets/adidas/atshirtm2.png";
import atshirt3 from "./assets/adidas/atshirtm3.png";
import adispz from "./assets/adidas/spezial.png";
import adispz1 from "./assets/adidas/spezial1.png";
import adispz2 from "./assets/adidas/spezial2.png";
import adispz3 from "./assets/adidas/spezial3.png";

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 1. Updated Data Structure para sa Hover-Sync (Variants)
  const [allProducts] = useState([
    { 
      id: 1, 
      title: "Artwork Tee", 
      brand: "Carhartt", 
      category: "Women", 
      subCategory: "Tops", 
      price: 3500, 
      img: chtop,
      variants: [
        { colorName: "White", colorHex: "#FFFFFF", image: chtop },
        { colorName: "Brown", colorHex: "#74512D", image: chhood }
      ]
    },
    { 
      id: 2, 
      title: "Urban Sling Bag", 
      brand: "Carhartt", 
      category: "Women", 
      subCategory: "Accessories", 
      price: 1200, 
      img: chhood,
      variants: [
        { colorName: "Brown", colorHex: "#74512D", image: chhood }
      ]
    },
    { 
      id: 3, 
      title: "Nike Hyverse Black", 
      brand: "Nike", 
      category: "Men", 
      subCategory: "T-Shirts", 
      price: 1800, 
      img: niket,
      variants: [
        { colorName: "Black", colorHex: "#000000", image: niket },
        { colorName: "White", colorHex: "#FFFFFF", image: niket1 },
        { colorName: "Dark Blue", colorHex: "#162A43", image: niket2 }
      ]
    },
     { 
      id: 4, 
      title: "Nike Dunk Low", 
      brand: "Nike", 
      category: "Men", 
      subCategory: "Shoes", 
      price: 5000, 
      img: nkdunk,
      variants: [
        { colorName: "deep navy blue", colorHex: "#162A43", image: nkdunk },
        { colorName: "black", colorHex: "#000000", image: nkdunk1 },
        { colorName: "pale peach", colorHex: "#ECD3CE", image: nkdunk2 },
        { colorName: "dusty teal", colorHex: "#7FA4AC", image: nkdunk3 },
        { colorName: "turquoise green", colorHex: "#00A18F", image: nkdunk4 }
      ]
    },
    { 
      id: 5, 
      title: "Adidas Round Neck T-Shirt", 
      brand: "Adidas", 
      category: "Men", 
      subCategory: "T-Shirts", 
      price: 1500, 
      img: atshirt,
      variants: [
        { colorName: "Black", colorHex: "#000000", image: atshirt1 },
        { colorName: "Red", colorHex: "#FF0000", image: atshirt2 },
        { colorName: "Blue", colorHex: "#0000FF", image: atshirt3 }
      ]
    },
     { 
      id: 6, 
      title: "Adidas T-Shirt", 
      brand: "Adidas", 
      category: "Men", 
      subCategory: "T-Shirts", 
      price: 1500, 
      img: atshirt,
      variants: [
        { colorName: "Black", colorHex: "#000000", image: atshirt},
      ]
    },
    { 
      id: 7, 
      title: "Adidas Spezial Hoodie", 
      brand: "Adidas", 
      category: "Men", 
      subCategory: "Hoodies", 
      price: 3500, 
      img: adispz,
      variants: [
        { colorName: "White", colorHex: "#FFFFFF", image: adispz },
        { colorName: "Black", colorHex: "#000000", image: adispz1 },
        { colorName: "Red", colorHex: "#FF0000", image: adispz2 },
        { colorName:"Blue" ,colorHex:"#4169E1" ,image :adispz3}
        
      ]
    }
  ]);

  // Logic Functions
  const handleSearch = (query) => {
    setSearchTerm(query);
    setIsShopView(true);
  };

  const openShop = (brand = "All", category = "All", sub = "All") => {
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
    const matchesSubCat = filters.subCategory === "All" || p.subCategory === filters.subCategory;
    return matchesSearch && matchesBrand && matchesCat && matchesSubCat;
  });

  // 2. Updated addToCart para sa Variants
  const addToCart = (productWithVariant) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find(
        (item) => item.id === productWithVariant.id && 
                  item.selectedColor?.colorName === productWithVariant.selectedColor?.colorName
      );
      if (isItemInCart) {
        return prev.map((item) =>
          (item.id === productWithVariant.id && item.selectedColor?.colorName === productWithVariant.selectedColor?.colorName)
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...productWithVariant, quantity: 1 }];
    });
    setCartModalOpen(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" finishLoading={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col min-h-screen bg-white text-black"
          >
            {/* 3. Sync Header Icons & Search */}
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
                  <div className="max-w-[1400px] mx-auto px-2 md:px-10">
                    <button onClick={goHome} className="group mb-8 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] hover:text-gray-500 transition-colors">
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

                    {/* 4. ProductGrid handles hover-sync internal logic */}
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
      </AnimatePresence>

      <FilterSidebar
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        filters={filters}
        setFilters={setFilters}
        allProducts={allProducts}
      />

      {/* Cart Modal Sync */}
      <CartModal 
        isOpen={cartModalOpen} 
        onClose={() => setCartModalOpen(false)} 
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </>
  );
}

export default App;