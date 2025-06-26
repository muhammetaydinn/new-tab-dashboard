import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "New Tab Dashboard",
        short_name: "Dashboard",
        description: "Simple dashboard for new tab page",
        theme_color: "#18181b",
        background_color: "#18181b",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiMyMmM1NWUiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyeiIvPgo8cGF0aCBkPSJNMTIgNkM4LjY5IDYgNiA4LjY5IDYgMTJzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  base: "./",
  server: {
    port: 3000,
    open: true,
  },
});
