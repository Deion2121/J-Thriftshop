import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/flogo.png"; 

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); 
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null; 

  return (
   
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center bg-white z-9999"
        >
          
          <motion.img
            src={logo}
            alt="Logo"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1.1, 0.95],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-35 h-35 object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
