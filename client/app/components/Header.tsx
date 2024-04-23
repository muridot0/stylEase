import clsx from 'clsx'
import React from 'react'

export default function Header() {
  const [toggleMenu, setToggleMenu] = React.useState(false)

  const showMenu = () => {
    setToggleMenu(!toggleMenu)
  }

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

      <div>
        <button
          className='border bg-[--node-bg-color] border-[--node-border-color] hover:bg-[--hover-bg-color] hover:text-[--hover-color] p-2 rounded-[50%]'
          onClick={showMenu}
        >
          <span className='i-lucide-menu flex text-2xl' />
        </button>
        <ul className={clsx('absolute mt-2 right-8 border bg-[--node-bg-color] border-[--node-border-color] w-max h-max p-4 rounded-[8px] transition-opacity ease-in-out', {'opacity-100': toggleMenu}, {'opacity-0': !toggleMenu})}>
          <div>
            <h2>Background Variant</h2>
            <li className='font-light'>Dots</li>
            <li className='font-light'>Cross</li>
            <li className='font-light'>lines</li>
          </div>
          <div className='mt-4'>
            <h2>Actions</h2>
            <li className='font-light'>Clear nodes</li>
            <li className='font-light'>Clear connections</li>
          </div>
          <div className='mt-4'>
            <h2>Controls</h2>
            <li className='font-light'>Dots</li>
            <li className='font-light'>Cross</li>
          </div>
        </ul>
      </div>
    </div>
  )
}
