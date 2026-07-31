import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Pinned explicitly: a stray package-lock.json in the home directory made
   * Turbopack infer /Users/devzfy as the workspace root.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
