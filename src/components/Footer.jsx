import React from "react";
import { ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-300"> 
      <div className="bg-gray-800">
        
        <div className="container mx-auto py-6 px-5 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-zinc-50 text-sm">
            © {new Date().getFullYear()} JTFT — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
