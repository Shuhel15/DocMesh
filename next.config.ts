import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.66.18.236"],
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
