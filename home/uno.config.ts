// uno.config.ts
import { defineConfig, presetWind, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  presets: [
    presetWind({ dark: 'media' }),
    presetIcons()
  ]
})
