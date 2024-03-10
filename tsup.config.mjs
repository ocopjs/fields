import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src", "!**/*.md"],
  format: ["cjs"],
  dts: false,
  treeshake: false,
  splitting: false,
});
