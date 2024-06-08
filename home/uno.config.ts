import { defineConfig, presetWind, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.([jt]sx|mdx?|html|ts|astro)($|\?)/]
    }
  },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  presets: [
    presetWind({ dark: 'media' }),
    presetIcons()
  ]
})
