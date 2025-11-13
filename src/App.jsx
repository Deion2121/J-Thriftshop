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
          className="fixed inset-0 z-50 flex bg-black/60 overflow-auto"
          onClick={() => setShopOpen(false)}
        >
          {/* Left Sidebar Filter */}
          <div
            className="w-80 bg-white p-6 text-black min-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Filters</h2>
            <div className="space-y-6">
              <div>
                <label className="font-semibold block mb-2">Category</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  <option>All</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Accessories</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-2">Price</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={filters.price}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, price: e.target.value }))
                  }
                >
                  <option>All</option>
                  <option>Under $50</option>
                  <option>$50 - $100</option>
                  <option>Over $100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div
            className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-screen bg-gray-50"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Ecommerce key={product.id} addToCart={() => addToCart(product)} />
              ))
            ) : (
              <p className="text-black text-lg col-span-full text-center mt-10">
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
