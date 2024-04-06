import { defineConfig, presetWind, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      '**/*.{html,js,ts,jsx,tsx}'
    ]
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
