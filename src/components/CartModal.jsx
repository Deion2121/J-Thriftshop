import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, Wallet, Truck, ChevronLeft, QrCode, MapPin } from "lucide-react";

const CartModal = ({ isOpen, onClose, cartItems, setCartItems }) => {
  const [view, setView] = useState("cart"); // "cart" o "payment"
  const [selectedPayment, setSelectedPayment] = useState("card");
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeItem = (id, colorName) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedColor?.colorName === colorName)));
  };

  const handleFinalPurchase = () => {
    // GENERATE UNIQUE ORDER ID
    const orderId = `ARC-${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    alert(
      `✅ ORDER CONFIRMED!\n\n` +
      `Order ID: ${orderId}\n` +
      `Payment via: ${selectedPayment.toUpperCase()}\n\n` +
      `Thank you! We will ship your items soon. Use the Order ID above to track your parcel with our courier partners.`
    );
    
    setCartItems([]);
    setView("cart");
    onClose();
  };

  const paymentMethods = [
    { id: "card", name: "Credit Card", icon: <CreditCard size={18} /> },
    { id: "gcash", name: "GCash / Maya", icon: <Wallet size={18} /> },
    { id: "cod", name: "Cash on Delivery", icon: <Truck size={18} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[300] backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[301] shadow-2xl flex flex-col border-l-[3px] border-black"
          >
            {/* HEADER */}
            <div className="p-6 border-b-[3px] border-black flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                {view === "payment" && (
                  <button 
                    onClick={() => setView("cart")} 
                    className="p-1 hover:bg-black hover:text-white border-2 border-black transition-all active:scale-90"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h2 className="font-black uppercase tracking-tighter text-2xl italic">
                  {view === "cart" ? "Bag Archive" : "Checkout"}
                </h2>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
                <X size={28} strokeWidth={3} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#fafafa]">
              {view === "cart" ? (
                /* --- CART VIEW --- */
                cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <ShoppingBag size={80} strokeWidth={1} />
                    <p className="font-black uppercase tracking-[0.5em] mt-4 text-xs">Empty Archive</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.selectedColor?.colorName}`} className="flex gap-4 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                        <div className="w-20 h-24 bg-gray-100 shrink-0 border border-black overflow-hidden">
                          <img src={item.selectedColor?.image || item.img} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[11px] font-black uppercase truncate pr-2">{item.title}</h3>
                            <button onClick={() => removeItem(item.id, item.selectedColor?.colorName)} className="text-gray-400 hover:text-black transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                            Qty: {item.quantity} | {item.selectedColor?.colorName}
                          </div>
                          <p className="text-sm font-black italic">₱{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* --- PAYMENT VIEW --- */
                <div className="space-y-6">
                  {/* Shipping Info Placeholder for distance context */}
                  <div className="bg-white border-2 border-black p-4 flex items-start gap-3">
                    <MapPin size={18} className="shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Delivery Context</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase leading-tight">Standard shipping rates apply for Provincial and remote areas.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 px-1">Payment Strategy</p>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`w-full flex items-center justify-between p-4 border-2 transition-all ${
                            selectedPayment === method.id ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" : "border-gray-200 bg-white hover:border-black"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {method.icon}
                            <span className="text-[11px] font-black uppercase tracking-widest">{method.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedPayment === 'gcash' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-white border-2 border-black p-6 flex flex-col items-center space-y-4 text-center"
                      >
                        <p className="text-[10px] font-black uppercase text-blue-600">Scan to Pay via GCash/Maya</p>
                        <div className="bg-gray-100 p-3 border-2 border-black">
                          <QrCode size={180} strokeWidth={1} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black">MY_STORE_ARCHIVE</p>
                          <p className="text-[8px] text-gray-400 italic">Please take a screenshot for proof of payment.</p>
                        </div>
                      </motion.div>
                    )}

                    {selectedPayment === 'cod' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-yellow-50 border-2 border-yellow-200"
                      >
                        <div className="flex gap-2">
                          <Truck size={14} className="text-yellow-800 shrink-0" />
                          <p className="text-[9px] font-bold text-yellow-800 leading-tight uppercase">
                            COD available for all locations. Please prepare exact amount to expedite delivery.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* LOGISTICS REMINDER */}
                  <div className="p-4 border-2 border-dashed border-gray-200">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Logistics Note:</p>
                    <p className="text-[9px] font-bold leading-tight text-gray-500">
                      Metro Manila: 2-3 Days <br />
                      Provincial: 5-8 Business Days <br />
                      Remote Areas: 10+ Business Days
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t-[3px] border-black">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black italic tracking-tighter leading-none">₱{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                
                {view === "cart" ? (
                  <button 
                    onClick={() => setView("payment")}
                    className="w-full bg-black text-white py-5 font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-3 group hover:bg-yellow-400 hover:text-black transition-all border-2 border-black active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Proceed to Pay
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalPurchase}
                    className="w-full bg-black text-white py-5 font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-green-500 transition-all border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  >
                    Confirm Purchase
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;