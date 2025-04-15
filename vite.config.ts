import { fileURLToPath, URL } from 'node:url'
import vue from "@vitejs/plugin-vue";
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/mixins.scss" as *;`,
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0", // 외부 접속을 허용하기 위해 0.0.0.0으로 설정
    hmr: {
      clientPort: 3000,
    },
    watch: {
      usePolling: true, // Docker 환경에서 HMR 동작 안 할 경우 폴링 활성화
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
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.ts': 'ts',
        '.js': 'js',
      }
    },
    include: ['vue', 'vue-router'],
  },
});
