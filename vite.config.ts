import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/Presente-react/",
  plugins: [react()],
  build: {
    outDir: "docs", // Mudando o diretório de saída para 'docs'
  },
});
