import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import preact from '@astrojs/preact'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), UnoCSS({ injectReset: true })]
})
