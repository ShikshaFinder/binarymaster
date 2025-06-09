import { motion } from "framer-motion";
import React, { useState } from "react";
import { ImagesSlider } from "./ui/images-slider";

export default function ImagesSliderDemo() {
  const [selectedNumber, setSelectedNumber] = useState("7984140706");
  const images = ["/transparancy.jpeg", "/trust.webp"];

  const phoneNumbers = {
    india: "7984140706",
    spain: "34652614894",
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumber(e.target.value);
  };

  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
      >
        <motion.p className="font-bold text-xl sm:text-3xl md:text-5xl lg:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4 max-w-4xl">
          Create Stunning Digital Products <br className="hidden sm:block" />{" "}
          Which your Users Love
        </motion.p>
        <div className="flex flex-col items-center gap-2">
          <select
            onChange={handleNumberChange}
            className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white rounded-full appearance-none cursor-pointer w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option
              value={phoneNumbers.india}
              className="bg-emerald-900/90 text-white"
            >
              India (+91 7984140706)
            </option>
            <option
              value={phoneNumbers.spain}
              className="bg-emerald-900/90 text-white"
            >
              Spain (+34 652 61 48 94)
            </option>
          </select>
          <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4 hover:bg-emerald-300/20 transition-colors duration-200">
            <a
              href={`https://wa.me/${selectedNumber}`}
              className="flex items-center justify-center"
            >
              <span className="text-sm sm:text-base">Connect Now →</span>
            </a>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </div>
      </motion.div>
    </ImagesSlider>
  );
}
