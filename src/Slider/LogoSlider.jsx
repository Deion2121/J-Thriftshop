import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import nike from "../assets/nike-logo.png";
import nb from "../assets/nb-logo.png";
import adidas from "../assets/Adidas_logo.png";
import ch from "../assets/carhartt-logo.png";

const LogoCarousel = () => {
  const logos = [nike, nb, adidas, ch];
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate width of scrollable content
  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth / 2; // duplicated logos
      setWidth(scrollWidth);
    }
  }, []);

  // Animate auto-scroll
  <motion.div
  animate={{ x: [-width, 0] }}
  transition={{
    x: {
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      duration: isHovered ? 8 : 15
    }
  }}
  style={{
    animationPlayState: isHovered ? "paused" : "running"
    
  }}
>
  {/* logo */}
</motion.div>
  return (
    <div
      className="relative w-full overflow-hidden bg-white py-24 flex justify-center items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-linear-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-linear-to-l from-white to-transparent z-10" />

      {/* Logo track */}
      <motion.div
        ref={carouselRef}
        className="flex gap-16 cursor-grab items-center"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -width, right: 0 }}
        dragElastic={0.1}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex justify-center items-center w-36 h-28 shrink-0"
          >
            <img
              src={logo}
              alt={`brand-logo-${i}`}
              className={`
                h-20 sm:h-24 md:h-28 w-auto object-contain
                grayscale hover:grayscale-0
                opacity-70 hover:opacity-100
                transition-all duration-300
                hover:scale-125
                hover:drop-shadow-xl
              `}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoCarousel;
