import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  build: {
    sourcemap: true,
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [ViteImageOptimizer()],
  resolve: {
    tsconfigPaths: true,
  },
});
