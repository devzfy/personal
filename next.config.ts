import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Pins the workspace root, which Turbopack would otherwise infer.
   *
   * This exists for one local reason: a stray package-lock.json in the home
   * directory made it infer /Users/devzfy as the root. It has no effect on CI,
   * where the repo is the only thing on disk.
   *
   * process.cwd() rather than __dirname: __dirname does not exist in ESM scope,
   * so if this config is ever loaded as a module rather than transpiled to CJS,
   * path.resolve(__dirname) throws a TypeError while the config is being read —
   * which kills the build before Next prints anything at all, and is close to
   * undebuggable from the log. cwd is defined under both module systems and is
   * the project root in both environments.
   */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
