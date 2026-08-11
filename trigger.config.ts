import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_isyixjxwxwchnmntortu",
  // Update this path to match your src directory structure:
  dirs: ["./src/trigger"],
  runtime: "node",
  logLevel: "log",
  build: {
    external: [
      "@react-pdf/renderer",
      // playwright-core dynamically requires chromium-bidi for the BiDi-over-CDP
      // path we never use (we connect to Browserless over WebSocket CDP). Marking
      // both external keeps esbuild from trying to resolve chromium-bidi's CJS
      // subpaths, which upstream removed in newer versions.
      "playwright-core",
      "chromium-bidi",
      // lighthouse reads its locales/ directory at runtime via fs.scandir,
      // which breaks when bundled into a single esbuild file.
      "lighthouse",
      "chrome-launcher",
    ],
  },
  maxDuration: 300,
});
