import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "valve.png",
      ],
      manifest: {
        name: "Уровень",
        short_name: "Уровень",
        description: "A Progressive Web App built with React and Vite",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "./train.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./train.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
