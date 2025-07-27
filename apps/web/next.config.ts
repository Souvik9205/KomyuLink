// apps/web/next.config.ts
import path from "path";
import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // point `@/` at the app’s folder
    config.resolve.alias ??= {};
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
