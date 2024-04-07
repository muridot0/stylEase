import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import UnoCSS from '@unocss/vite'

installGlobals();

export default defineConfig({
  plugins: [remix({ignoredRouteFiles: ["**/.*"]}), UnoCSS(), tsconfigPaths()],
});
