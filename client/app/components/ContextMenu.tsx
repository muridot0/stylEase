import clsx from 'clsx'
import React from 'react'
import { BackgroundVariant } from 'reactflow'
import RadioItemWithProvider from './RadioItem'

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
      <div className='mb-2'>
        <h2 className='font-semibold text-lg'>Background Variant</h2>
        {(Object.keys(BackgroundVariant) as Array<BackgroundVariant>).map(
          (key) => (
            <RadioItemWithProvider value={key} key={key} />
          )
        )}
      </div>
      <hr className='border-t-[--node-border-color]'/>
      <h2 className='font-semibold text-lg mt-2'>Actions</h2>
      <li className='font-light'>Clear nodes</li>
      <li className='font-light'>Clear connections</li>
    </ul>
  )
}
