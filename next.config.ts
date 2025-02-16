import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    //unoptimized: true,
    //loader: "cloudinary",
    //path: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`,
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "media.licdn.com",
      "assets.aceternity.com",
      "asset.cloudinary.com",
      "assets-global.website-files.com",
      "www.swinglifestyle.com",
      "aviationmaintenance.edu",
      "www.aviationmaintenance.edu",
      "b3314629.smushcdn.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "raw.githubusercontent.com",
      "github.com",
    ],
  },
};

export default nextConfig;
