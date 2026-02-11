import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";

const CartModal = ({ isOpen, onClose, cartItems, setCartItems }) => {
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
            className="fixed inset-0 bg-black/60 z-300 backdrop-blur-sm"
          />

          {/* SIDEBAR */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-301 shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-black uppercase tracking-tighter text-xl">Your Bag [{cartItems.length}]</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            {/* ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">Your bag is empty</p>
                  <button onClick={onClose} className="text-xs font-bold underline uppercase tracking-widest">Start Shopping</button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedColor?.colorName}`} className="flex gap-4 border-b border-gray-50 pb-6">
                    <div className="w-24 h-32 bg-gray-100 shrink-0">
                      <img src={item.selectedColor?.image || item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-[11px] font-black uppercase tracking-tight">{item.title}</h3>
                          <button onClick={() => removeItem(item.id, item.selectedColor?.colorName)}>
                            <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{item.brand}</p>
                        <p className="text-[10px] mt-2 font-medium">Color: {item.selectedColor?.colorName || 'Default'}</p>
                        <p className="text-[10px] font-medium">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[12px] font-black italic">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER / CHECKOUT */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-gray-50 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Subtotal</span>
                  <span className="text-xl font-black italic">₱{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed">Shipping and taxes calculated at checkout.</p>
                <button className="w-full bg-black text-white py-5 font-black uppercase text-[11px] tracking-[0.3em] hover:bg-zinc-800 transition-colors">
                  Checkout Now
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