import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src", "!**/*.md"],
  format: ["cjs", "esm"],
  dts: false,
  treeshake: false,
  splitting: false,
});
