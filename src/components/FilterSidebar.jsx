import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterAccordion from "./FilterAccordion";
import { X, ArrowLeft, CheckCircle2, QrCode } from "lucide-react";

const FilterSidebar = ({ isOpen, onClose, filters, setFilters, allProducts = [], cartItems = [] }) => {
  const [view, setView] = useState("filter"); // views: "filter", "checkout", "success"
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQR, setShowQR] = useState(false);

  const brandOptions = ["Nike", "Adidas", "Polo RL", "Vans", "Converse", "Puma", "Tommy Hilfiger", "New Balance", "Reebok", "Fila", "Uniqlo", "Champion", "Carhartt", "Guess"];
  const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];
  const genderOptions = ["Men", "Women", "Unisex"];
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  // CALCULATIONS
  const filteredCount = useMemo(() => {
    return allProducts.filter(product => {
      const matchBrand = filters.brand === "All" || product.brand === filters.brand;
      const matchGender = !filters.gender || product.category === filters.gender;
      return matchBrand && matchGender;
    }).length;
  }, [filters, allProducts]);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleUpdate = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? (key === 'brand' ? "All" : null) : value,
    }));
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) return alert("Select Payment Method first!");
    setView("success");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-[120] shadow-2xl flex flex-col border-l-4 border-black"
          >
            {/* HEADER - DYNAMIC */}
            <div className="p-6 flex justify-between items-center border-b-2 border-black bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                {view !== "filter" && view !== "success" && (
                  <button onClick={() => setView("filter")} className="hover:bg-gray-100 p-1"><ArrowLeft size={20}/></button>
                )}
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {view === "filter" ? "Filter & Sort" : view === "checkout" ? "Checkout" : "Order Success"}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              
              {/* VIEW 1: FILTERING */}
              {view === "filter" && (
                <div className="space-y-2">
                  <FilterAccordion title="Sort By" items={sortOptions} selected={filters.sort} onSelect={(val) => handleUpdate("sort", val)} />
                  <FilterAccordion title="Gender" items={genderOptions} selected={filters.gender} onSelect={(val) => handleUpdate("gender", val)} />
                  <FilterAccordion title="Brands" items={brandOptions} selected={filters.brand} onSelect={(val) => handleUpdate("brand", val)} />
                  <FilterAccordion title="Size" items={sizeOptions} selected={filters.size} onSelect={(val) => handleUpdate("size", val)} />
                  
                  {cartItems.length > 0 && (
                    <div className="mt-10 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Ready to cop?</p>
                       <button 
                        onClick={() => setView("checkout")}
                        className="w-full py-4 bg-yellow-400 text-black font-black uppercase italic tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                       >
                         Proceed to Checkout ({cartItems.length})
                       </button>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: CHECKOUT */}
              {view === "checkout" && (
                <div className="space-y-8">
                  {/* Order Summary Sticker */}
                  <div className="bg-gray-100 p-4 border-2 border-black rotate-1">
                    <p className="font-mono text-[10px] uppercase border-b border-black pb-2 mb-2">Manifest_Receipt.txt</p>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between font-bold text-xs uppercase mb-1">
                        <span>{item.title}</span>
                        <span>₱{item.price}</span>
                      </div>
                    ))}
                    <div className="border-t-2 border-black mt-4 pt-2 flex justify-between font-black text-xl italic">
                      <span>TOTAL:</span>
                      <span>₱{totalAmount}</span>
                    </div>
                  </div>

                  {/* Mode of Payment */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Payment Method</p>
                    <div className="grid grid-cols-1 gap-2">
                      {["GCash", "Maya", "COD"].map((mop) => (
                        <button
                          key={mop}
                          onClick={() => {
                            setPaymentMethod(mop);
                            if(mop === "GCash") setShowQR(true); else setShowQR(false);
                          }}
                          className={`p-4 border-2 flex justify-between items-center transition-all ${paymentMethod === mop ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 font-bold'}`}
                        >
                          <span className="uppercase italic font-black">{mop}</span>
                          {paymentMethod === mop && <CheckCircle2 size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GCash QR Popup Logic */}
                  <AnimatePresence>
                    {showQR && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="bg-blue-50 border-2 border-blue-500 p-6 text-center space-y-4">
                        <p className="text-[10px] font-black text-blue-600 uppercase">Scan to Pay via GCash</p>
                        <div className="bg-white p-2 inline-block border-2 border-blue-500">
                           <QrCode size={150} className="mx-auto text-blue-600" />
                        </div>
                        <p className="text-[9px] font-mono text-blue-400 tracking-tighter uppercase">Account: THRIFT FINDS ARCHIVE<br/>0917-XXX-XXXX</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* VIEW 3: SUCCESS */}
              {view === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-black uppercase italic italic leading-none">Order <br/> Confirmed!</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Wait for our text for tracking details.</p>
                  <button onClick={onClose} className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest">Back to Browsing</button>
                </div>
              )}
            </div>

            {/* FOOTER BUTTON */}
            {view !== "success" && (
              <div className="p-6 border-t-2 border-black bg-white">
                <button
                  onClick={view === "filter" ? onClose : handlePlaceOrder}
                  className="w-full py-5 bg-black text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                >
                  {view === "filter" ? `SHOW RESULTS (${filteredCount})` : "CONFIRM & PLACE ORDER"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;