import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: "https://muri-o.com/stylease",
  integrations: [react(), UnoCSS({ injectReset: true })]
})
