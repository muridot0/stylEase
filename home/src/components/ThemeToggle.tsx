import { useEffect, useState } from 'preact/hooks'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const updateSourceMedia = (colorPreference: 'light' | 'dark'): void => {
      const pictures = document.querySelectorAll('picture')

      pictures.forEach((picture) => {
        const sources: NodeListOf<HTMLSourceElement> =
          picture.querySelectorAll(`
            source[media*="prefers-color-scheme"],
            source[data-media*="prefers-color-scheme"]
          `)

        sources.forEach((source) => {
          // Preserve the source `media` as a data-attribute
          // to be able to switch between preferences
          if (source?.media.includes('prefers-color-scheme')) {
            source.dataset.media = source.media
          }

          // If the source element `media` target is the `preference`,
          // override it to 'all' to show
          // or set it to 'none' to hide
          if (source.dataset.media?.includes(colorPreference)) {
            source.media = 'all'
          } else if (source) {
            source.media = 'none'
          }
        })
      })
    }

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      updateSourceMedia('dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      updateSourceMedia('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button class='mr-8 flex items-center' onClick={handleClick}>
      {theme === 'light' ? (
        <>
          <span class='material-symbols-rounded mr-2 !text-base'>
            dark_mode
          </span>
          <span class="mt-1">Dark mode</span>
        </>
      ) : (
        <>
          <span class='material-symbols-rounded mr-2 !text-base'>
            light_mode
          </span>
          <span class="mt-1">Light mode</span>
        </>
      )}
    </button>
  )
}
