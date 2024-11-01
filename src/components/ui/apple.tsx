"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Let's Create Products which can be loved by your users .
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                <a href="https://wa.me/917984140706">
                  {" "}
                  Connect Us On What'sAPP
                </a>
              </span>{" "}
              It is Free To share the idea & Know the Pricing
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "Creating great products with AI.",
    src: "/ai.jpeg",
    content: <DummyContent />,
  },
  {
    category: "App Development",
    title: "Create stunning cross-platform apps.",
    src: "/appdevelopment.jpeg",
    content: <DummyContent />,
  },
  {
    category: "Game Development",
    title: "Create Greate Games",
    src: "/aipowered.webp",
    content: <DummyContent />,
  },
  {
    category: "Web Development",
    title:
      "Create websites that are loved by your users and easily found on Google.",
    src: "/appinnovation.webp",
    content: <DummyContent />,
  },
  {
    category: "Cyber Security",
    title: "Secure your sites and find vulnerabilities in your existing sites.",
    src: "/cs.webp",
    content: <DummyContent />,
  },
];
