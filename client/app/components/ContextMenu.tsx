import clsx from 'clsx'
import React from 'react'
import RadioItem from './RadioItem'
import { Background, BackgroundProps, BackgroundVariant } from 'reactflow'

interface Props {
  toggleMenu: boolean
}

export default function ContextMenu({ toggleMenu }: Props) {
  //TODO: add functionality to close menu when click outside of menu

  const ulRef = React.useRef<HTMLUListElement>(null)

  // React.useEffect(() => {
  // }, [])

  return (
    <ul
      ref={ulRef}
      className={clsx(
        'absolute mt-2 right-8 border bg-[--node-bg-color] border-[--node-border-color] w-max h-max p-4 rounded-[8px] transition-opacity ease-in-out',
        { 'opacity-100': toggleMenu },
        { 'opacity-0': !toggleMenu }
      )}
    >
      <div>
        <h2>Background Variant</h2>
        {(
          Object.keys(BackgroundVariant) as Array<
            BackgroundVariant
          >
        ).map((key) => (
          <RadioItem value={key} />
        ))}
        <li className='font-light'>Cross</li>
        <li className='font-light'>lines</li>
      </div>
      <div className='mt-2'>
        <h2>Actions</h2>
        <li className='font-light'>Clear nodes</li>
        <li className='font-light'>Clear connections</li>
      </div>
      <div className='mt-2'>
        <h2>Controls</h2>
        <li className='font-light'>Dots</li>
        <li className='font-light'>Cross</li>
      </div>
    </ul>
  )
}
