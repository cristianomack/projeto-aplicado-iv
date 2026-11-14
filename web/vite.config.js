import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" faz o build funcionar em qualquer subcaminho (GitHub Pages de projeto ou de organização)
export default defineConfig({ plugins: [react()], base: "./" });
