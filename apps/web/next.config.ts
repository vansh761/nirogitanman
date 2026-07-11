import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pins the monorepo root explicitly so Next.js stops guessing (and
  // warning) about which lockfile/workspace root to use.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
