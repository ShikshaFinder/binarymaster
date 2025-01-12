import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function AnimatedTestimonialsDemo() {
const testimonials = [
  {
    quote:
      "Shiksha Finder is a platform built with strong SEO ranking. It connects databases with platform.shikshafinder.com and implements Google Ads.",
    name: "Shikshafinder.com",
    designation: "Educational Institution's Marketplace",
    src: "/sf_bm.webp",
  },
  {
    quote:
      "At GTU Ventures, we needed to meet a short timeline as this website was inaugurated by prominent government officials.",
    name: "GTUVentures.com",
    designation: "A site for startups",
    src: "/gtu_bm.png",
  },
  {
    quote:
      "Our first project where we provided services to delight the client. We gathered the requirements and provided additional functionalities and integrations.",
    name: "Ramyantara.com",
    designation: "Our First Project!",
    src: "/ramyantra.png",
  },
  {
    quote:
      "Built with Tailwind CSS, one of the projects that we are proud of creating.",
    name: "LDCE-web-nine.vercel.app",
    designation: "A college website",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRfktdqhQSWpJmqCfTzhHNjmvjgyFNbnLJ-w&s",
  },
  {
    quote:
      "Women At Work is one of the startups that we are proud of creating. We provided services to delight and engage the users.",
    name: "WomenAtWork",
    designation: "A startup for Women's empowerment",
    src: "/waw.png",
  },
];
  return (
    <>
    <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Why our clients love us?🚀
        </h1>

      <AnimatedTestimonials testimonials={testimonials} />;
    </>
  );
}
