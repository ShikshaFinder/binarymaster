import supabase from "../../supabase";
import React, { useState, lazy, Suspense } from "react";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { motion, useTransform, useScroll } from "framer-motion";
import { Button } from "@/components/ui/moving-border";
import Hero from "../components/Hero";

// Lazy load components that are not immediately visible
const LampContainer = lazy(() =>
  import("@/components/ui/lamp").then((mod) => ({ default: mod.LampContainer }))
);
const TextGenerateEffect = lazy(
  () => import("@/components/ui/text-generate-effect")
);
const GoogleGeminiEffect = lazy(() =>
  import("@/components/ui/google-gemini-effect").then((mod) => ({
    default: mod.GoogleGeminiEffect,
  }))
);
const AppleCardsCarouselDemo = lazy(() =>
  import("@/components/ui/apple").then((mod) => ({
    default: mod.AppleCardsCarouselDemo,
  }))
);
const SparklesPreview = lazy(() =>
  import("@/components/MVP").then((mod) => ({ default: mod.SparklesPreview }))
);
const AnimatedTestimonialsDemo = lazy(() =>
  import("@/components/Testimonials").then((mod) => ({
    default: mod.AnimatedTestimonialsDemo,
  }))
);

function Index() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const wordz = [
    {
      text: "Connect with",
    },
    {
      text: "Us ",
    },
    {
      text: "Now !",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const word = `Binary Master.Tech`;
  const comapny = "GWSF Ventures PVT LTD (Registered Under Startup India)";
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  const handleEmailSubmit = async () => {
    if (!email) {
      setStatus("Please enter an email.");
      return;
    }

    const { data, error } = await supabase.from("email").insert([{ email }]);

    if (error) {
      setStatus("Error submitting email.");
      console.error(error);
    } else {
      setStatus("Email added successfully!");
      setEmail("");
    }
  };

  return (
    <>
      <Hero />
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <TextGenerateEffect words={word} />
      </Suspense>
      <div className="flex flex-col items-center justify-center h-[40rem]">
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
          Let's Connect & build something great together
        </p>
        <TypewriterEffectSmooth words={wordz} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <input
            type="text"
            placeholder="hello@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full relative z-10 mt-4 bg-neutral-50 placeholder:text-neutral-700 p-3"
          />
        </div>
        <br />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <Button
            className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
            onClick={handleEmailSubmit}
          >
            Connect Now
          </Button>
        </div>
        {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AnimatedTestimonialsDemo />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Build, Scale, and Earn <br /> with your idea ! 🚀
          </motion.h1>
        </LampContainer>
      </Suspense>
      <br />
      <div className="flex flex-col md:flex-row justify-center items-center space-y-56  md:space-y-59 md:space-x-4 mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SparklesPreview />
        </Suspense>
      </div>
      <div className="h-[40rem] flex flex-col md:flex-row justify-center items-center px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <GoogleGeminiEffect
            pathLengths={[
              pathLengthFirst,
              pathLengthSecond,
              pathLengthThird,
              pathLengthFourth,
              pathLengthFifth,
            ]}
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <AppleCardsCarouselDemo />
        </Suspense>
      </div>
      <br />
      <div className="h-[40rem] flex flex-col md:flex-row justify-center items-center px-4">
        <TextGenerateEffect words={comapny} />
      </div>
    </>
  );
}

export default Index;
