"use client";

import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Harsh Jani",
    designation: "Founder & Product Manager",
    image: "/team/harsh.jpg",
    url: "https://www.linkedin.com/in/sfharsh/",
  },
  {
    id: 2,
    name: "Mansi Patel",
    designation: "Customer Success Manager",
    image: "/team/mansimam.jpeg",
    url: "https://www.linkedin.com/in/mansipatelce/",
  },
  {
    id: 3,
    name: "Dhruvil Moradiya",
    designation: "Full Stack Developer & CTO",
    image: "/team/dhruvil.jpeg",
    url: "https://www.linkedin.com/in/mdhruvil/",
  },
  {
    id: 4,
    name: "Ansh Chamariya",
    designation: "Full Stack Developer",
    image: "/team/ansh.jpeg",
    url: "https://www.linkedin.com/in/anshchamriya/",
  },
  {
    id: 5,
    name: "Harsh Gavit",
    designation: "Frontend Developer",
    image: "/team/havit.jpeg",
    url: "https://www.linkedin.com/in/havitonline/",
  },

  {
    id: 6,
    name: "Rudra Modi",
    designation: "AI ML Developer",
    image: "/team/rudra.jpeg",
    url: "https://www.linkedin.com/in/rudra-modi/",
  },
];
export default function Team() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals behind BinaryMaster. We're a diverse
            team of passionate developers and innovators.
          </p>
        </div>

        <div className="flex flex-row items-center justify-center w-full">
          <div className="flex flex-row items-center justify-center w-full">
            <AnimatedTooltip items={people} />
          </div>
        </div>
      </div>
    </div>
  );
}
