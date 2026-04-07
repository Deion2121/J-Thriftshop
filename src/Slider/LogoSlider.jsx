import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import nike from "../assets/nike-logo.png";
import nb from "../assets/nb-logo.png";
import adidas from "../assets/Adidas_logo.png";
import ch from "../assets/carhartt-logo.png";
import vans from "../assets/vans.png";
import champion from "../assets/champion.png";
import tommy from "../assets/tommy.png";
import rlpolo from "../assets/rlpolo.png";
import converse from "../assets/converse_logo.png";
import fila from "../assets/fila_logo.png";
import guess from "../assets/guess_logo.png";
import hm from "../assets/h&m_logo.png";
import puma from "../assets/puma_logo.png";
import reebok from "../assets/reebok_logo.png";

const logos = [
  nike, nb, adidas, ch, vans, champion,
  tommy, rlpolo, converse, fila, guess, hm, puma, reebok
];

const LogoCarousel = () => {
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth / 4);
    }
  }, []);

  const startAnimation = () => {
    controls.start({
      x: [-width, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: 22,
        },
      },
    });
  };

  useEffect(() => {
    if (width > 1) startAnimation();
  }, [width]);

  return (
    <section className="relative w-full overflow-hidden bg-[#f9f7f4] py-0">

      {/* Top border rule */}
      <div className="w-full h-px bg-[#e8e5e0]" />

      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-14 pb-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-6 h-px bg-[#c8a96e]" />
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c8a96e] font-bold">
              Our Brands
            </p>
          </div>
          <h2
            className="text-3xl md:text-4xl font-black uppercase italic tracking-[-0.03em] leading-none text-[#111]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Top Labels
          </h2>
        </div>
        <p className="hidden md:block text-[9px] tracking-[0.3em] uppercase text-black/25 font-bold pb-1">
          {logos.length} Brands
        </p>
      </div>

      {/* Carousel track */}
      <div className="relative pb-14">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-[#f9f7f4] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-[#f9f7f4] to-transparent z-10" />

        <motion.div
          ref={carouselRef}
          className="flex gap-0 items-center cursor-grab w-max"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.05}
          onDragStart={() => controls.stop()}
          onDragEnd={() => startAnimation()}
        >
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="group relative flex justify-center items-center w-44 h-24 shrink-0 border-r border-[#e8e5e0] px-8"
            >
              {/* Hover bg flash */}
              <div className="absolute inset-0 bg-[#111] opacity-0 group-hover:opacity-100 transition-all duration-300" />

              <img
                src={logo}
                alt={`brand-logo-${i}`}
                className="relative z-10 h-10 sm:h-12 w-auto object-contain
                  opacity-30 group-hover:opacity-100
                  filter group-hover:brightness-0 group-hover:invert
                  transition-all duration-300
                  group-hover:scale-110"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom border rule with gold accent */}
      <div className="relative w-full h-px bg-[#e8e5e0]">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#c8a96e]"
          initial={{ width: "0%" }}
          whileInView={{ width: "30%" }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        />
      </div>

    </section>
  );
};

export default LogoCarousel;