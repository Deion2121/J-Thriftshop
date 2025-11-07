import React from "react";
import { ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-300">
      <div className="container px-5 py-12 mx-auto flex flex-wrap justify-between gap-10 text-center md:text-left">
        {/* Brand */}
        <div className="w-full sm:w-1/2 md:w-1/4">
          <div className="flex =justify-center md:justify-start items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-indigo-900" />
            <span className="text-xl font-semibold text-black">ShopEase</span>
          </div>
          <p className="mt-4 text-black text-base">
            Your one-stop shop for quality and style. Shop smart, shop easy.
          </p>
        </div>

        {/* Links */}
        {["QUICK LINKS", "SUPPORT", "FOLLOW US"].map((title, i) => (
          <div key={i} className="w-full sm:w-1/2 md:w-1/4">
            <h2 className="font-medium text-black text-sm mb-2">{title}</h2>
            <nav className="list-none space-y-2">
              {["Home", "Shop", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-black hover:text-red-600 transition">
                    {item}
                  </a>
                </li>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="bg-gray-800">
        <div className="container mx-auto py-4 px-5 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-zinc-50 text-sm">
            © {new Date().getFullYear()} J-THRIFTSHOP — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
