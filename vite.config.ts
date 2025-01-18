import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/styles/variables.scss";`,
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: {
      clientPort: 3000,
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    commonjsOptions: {
      esmExternals: true,
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'radix-vue',
      '@vueuse/core',
      'axios',
      'crypto-js'
    ],
    exclude: [],
    esbuildOptions: {
      loader: {
        '.ts': 'ts',
        '.js': 'js',
      },
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          importsNotUsedAsValues: 'preserve',
        },
      },
    },
  },
});