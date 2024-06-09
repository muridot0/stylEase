import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://stylEase.muri-o.com',
  integrations: [react(), UnoCSS({ injectReset: true })]
})
