import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/numbering-system",
  assetPrefix: "/numbering-system/",
};

export default nextConfig;
