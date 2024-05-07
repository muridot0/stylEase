import { defineConfig, presetUno, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.([jt]sx|mdx?|html|ts)($|\?)/]
    }
  },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  presets: [
    presetUno({ dark: 'media' }),
    presetIcons()
  ]
})

