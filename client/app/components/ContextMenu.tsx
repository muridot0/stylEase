import clsx from 'clsx'
import React from 'react'
import { BackgroundVariant, useReactFlow } from 'reactflow'
import RadioItemWithProvider from './RadioItem'
import { Bounce, Id, ToastContainer, toast } from 'react-toastify'
import DeleteMsg from './DeleteMsg'

interface Props {
  toggleMenu: boolean
}

export default function ContextMenu({ toggleMenu }: Props) {
  //TODO: add functionality to close menu when click outside of menu
  const ulRef = React.useRef<HTMLUListElement>(null)
  const toastRef = React.useRef<Id | null>(null)

  const reactflow = useReactFlow()

  const deleteNodes = () => {
    const nodes = reactflow.getNodes()
    reactflow.deleteElements({nodes})
    if(toastRef.current){
      toast.dismiss(toastRef.current)
    }
  }

  const cancelDelete = () => {
    if(toastRef.current) {
      toast.dismiss(toastRef.current)
    }
  }

  const clearNodes = () => {
    toastRef.current =  toast(<DeleteMsg onDelete={deleteNodes} onCancel={cancelDelete}/>, {
      position: "top-center",
      autoClose: false,
      pauseOnHover: true,
      draggable: true,
      transition: Bounce,
      });

    return toastRef.current
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