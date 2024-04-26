import React from 'react'
import ContextMenu from './ContextMenu'

export default function Header() {
  const [toggleMenu, setToggleMenu] = React.useState(false)
  const contextRef = React.useRef<HTMLDivElement>(null)

  const showMenu = (): void => setToggleMenu(!toggleMenu)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as HTMLElement)) {
        setToggleMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [toggleMenu])

  return (
    <div className='absolute z-1 flex justify-between items-center w-full px-8 py-2'>
      <div className='flex items-center'>
        <picture className='mr-4'>
          <source
            srcSet='stylEase-dark.svg'
            media='(prefers-color-scheme: dark)'
          />
          <img src='/stylEase-light.svg' alt='stylEase' />
        </picture>
        <h2 className='mt-1 text-xl font-bold'>stylEase</h2>
      </div>
      <ContextMenu
        toggleMenu={toggleMenu}
        showMenu={showMenu}
        ref={contextRef}
      />
    </div>
  )
}
