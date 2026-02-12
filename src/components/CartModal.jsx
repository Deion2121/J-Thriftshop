import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const CartModal = ({ isOpen, onClose, cartItems, setCartItems, openCheckout }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeItem = (id, colorName) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedColor?.colorName === colorName)));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[300] backdrop-blur-sm"
          />

          {/* SIDEBAR */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[301] shadow-2xl flex flex-col border-l-2 border-black"
          >
            {/* HEADER */}
            <div className="p-6 border-b-2 border-black flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} strokeWidth={2.5} />
                <h2 className="font-black uppercase tracking-tighter text-2xl italic">Bag Archive</h2>
                <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold rounded-full">
                  {cartItems.length}
                </span>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 uppercase text-[10px] font-black tracking-[0.3em]">Archive is empty</p>
                    <button 
                      onClick={onClose} 
                      className="text-xs font-black border-b-2 border-black uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-all"
                    >
                      Start Hunting
                    </button>
                  </div>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedColor?.colorName}`} className="flex gap-4 border-b-2 border-dashed border-gray-100 pb-6 group">
                    <div className="w-24 h-32 bg-gray-100 shrink-0 border border-gray-200 overflow-hidden relative">
                      <img 
                        src={item.selectedColor?.image || item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-[12px] font-black uppercase tracking-tighter leading-tight">{item.title}</h3>
                          <button 
                            onClick={() => removeItem(item.id, item.selectedColor?.colorName)}
                            className="p-1 hover:bg-red-50 rounded transition-colors group/trash"
                          >
                            <Trash2 size={16} className="text-gray-300 group-hover/trash:text-red-500" />
                          </button>
                        </div>
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{item.brand}</p>
                        <div className="pt-2 space-y-0.5">
                          <p className="text-[9px] font-bold uppercase text-gray-500">Color: {item.selectedColor?.colorName || 'Default'}</p>
                          <p className="text-[9px] font-bold uppercase text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-[14px] font-black italic tracking-tighter">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER / CHECKOUT */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-white border-t-2 border-black space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Subtotal</span>
                    <span className="text-2xl font-black italic tracking-tighter leading-none">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 flex">
                     <div className="h-full bg-black w-2/3"></div> {/* Decorative progress bar */}
                  </div>
                </div>
                
                <p className="text-[8px] font-mono text-gray-400 uppercase leading-relaxed border-l-2 border-gray-200 pl-3">
                  Shipping, customs, and taxes are calculated during the next step. <br/>
                  All thrifted items are final sale.
                </p>

                {/* UPDATED BUTTON: Calls openCheckout */}
                <button 
                  onClick={openCheckout}
                  className="w-full bg-black text-white py-5 font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 group hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                >
                  Confirm & Checkout
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;