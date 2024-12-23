import React from "react";
import { BackgroundBeams } from "../components/ui/background-beams";

function waitlist() {
  return (
    <div className="h-[45rem] w-full  rounded-md bg-neutral-000 relative flex flex-col items-center justify-center antialiased">
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
        Join the waitlist
      </h1>
      <p></p>
      <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
        and be the one who talks with documents. We will connect with you once the project is
        completed.
      </p>
      <input
        type="text"
        placeholder="hello@gmail.com"
        className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full relative z-10 mt-4 bg-neutral-50 placeholder:text-neutral-700 p-3"
      />
    </div>
      <BackgroundBeams />
    </div>
  );
}

export default waitlist;
