import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 3101,
    strictPort: true,
    allowedHosts: ["matrixmony.localhost"],
  },
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
