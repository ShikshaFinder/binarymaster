/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "assets.aceternity.com",
      "ldce-web-nine.vercel.app",
      "encrypted-tbn0.gstatic.com",
    ],
  },
};

export default nextConfig;
