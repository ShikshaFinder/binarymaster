import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";

export default function ImagesSliderDemo() {
  const images = ["/transparancy.jpeg", "/trust.webp"];
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
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4 hover:bg-emerald-300/20 transition-colors duration-200">
          <a
            href="https://wa.me/917984140706"
            className="flex items-center justify-center"
          >
            <span className="text-sm sm:text-base">Connect Now →</span>
          </a>
          <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
