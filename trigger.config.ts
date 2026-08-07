import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_isyixjxwxwchnmntortu",
  // Update this path to match your src directory structure:
  dirs: ["./src/trigger"],
  runtime: "node",
  logLevel: "log",
  build: {
    external: ["@react-pdf/renderer"],
  },
  maxDuration: 300,
});
