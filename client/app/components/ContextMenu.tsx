import clsx from 'clsx'
import React from 'react'
import { BackgroundVariant, useReactFlow } from 'reactflow'
import RadioItemWithProvider from './RadioItem'
import { Bounce, ToastContainer, toast } from 'react-toastify'

interface Props {
  toggleMenu: boolean
}

export default function ContextMenu({ toggleMenu }: Props) {
  //TODO: add functionality to close menu when click outside of menu
  const ulRef = React.useRef<HTMLUListElement>(null)

  const reactflow = useReactFlow()

  const clearNodes = () => {
    //TODO: use react toastify to query user if they really wanna delete all nodes
    // const nodes = reactflow.getNodes()
    // reactflow.deleteElements({nodes})
    return toast('🦄 Wow so easy!', {
      position: "top-center",
      autoClose: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      transition: Bounce,
      });
  }

  const clearConnections = () => {
    const edges = reactflow.getEdges()
    reactflow.deleteElements({edges})
  }

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
        <h2 className='font-semibold text-lg mb-2'>Background Variant</h2>
        {(Object.keys(BackgroundVariant) as Array<BackgroundVariant>).map(
          (key) => (
            <RadioItemWithProvider value={key} key={key} />
          )
        )}
      </div>
      <hr className='border-t-[--node-border-color]' />
      <h2 className='font-semibold text-lg mt-2'>Actions</h2>
      <li className='mt-2'>
        <button
          className='flex items-center gap-2'
          onClick={clearConnections}
        >
          <span className='i-lucide-unlink flex' /> Clear connections
        </button>
      </li>
      <li className='mt-2'>
        <button
          className='flex items-center gap-2 text-red-500'
          onClick={clearNodes}
        >
          <span className='i-lucide-trash2 flex' /> Clear nodes
        </button>
      </li>
    </ul>
  )
}
