import clsx from 'clsx'
import React from 'react'
import { BackgroundVariant, useReactFlow } from 'reactflow'
import RadioItemWithProvider from './RadioItem'
import setRef from '~/lib/setRef'
import { initialEdges, initialNodes } from '~/state/nodesState'

interface Props {
  toggleMenu: boolean
  showMenu: () => void
}

export default React.forwardRef(function ContextMenu(
  { toggleMenu, showMenu }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  //TODO: add functionality to close menu when click outside of menu
  const contextRef = React.useRef<HTMLDivElement>(null)
  const [hideDelete, setHideDelete] = React.useState(true)

  const reactflow = useReactFlow()

  React.useEffect(() => {
    setHideDelete(toggleMenu)
  }, [toggleMenu])

  const deleteNodes = () => {
    setHideDelete(true)
    const nodes = reactflow.getNodes()
    const edges = reactflow.getEdges()
    reactflow.deleteElements({ nodes, edges })
  }

  const clearConnections = () => {
    const edges = reactflow.getEdges()
    reactflow.deleteElements({ edges })
  }

  const resetCanvas = () => {
    deleteNodes()
    setTimeout(() => {
      reactflow.setNodes(initialNodes)
      reactflow.setEdges(initialEdges)
    }, 100)
  }

  React.useEffect(() => {
    setRef(ref, contextRef.current)
  }, [])

  return (
    <div ref={contextRef}>
      <button
        className='border bg-[--node-bg-color] border-[--node-border-color] hover:bg-[--hover-bg-color] hover:text-[--hover-color] p-2 rounded-[50%]'
        onClick={showMenu}
      >
        <span className='i-lucide-menu flex text-2xl' />
      </button>
      <ul
        className={clsx(
          'overflow-hidden absolute mt-2 right-8 border bg-[--node-bg-color] border-[--node-border-color] w-[12.5rem] h-max p-4 rounded-[8px] transition-opacity ease-in-out',
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
        <div className='overflow-hidden'>
          <h2 className='font-semibold text-lg mt-2'>Actions</h2>
          <li className='mt-2'>
            <button className='flex items-center gap-2' onClick={resetCanvas}>
              <span className='i-lucide-refresh-ccw flex' /> Reset canvas
            </button>
          </li>
          <li className='my-2'>
            <button
              className='flex items-center gap-2'
              onClick={clearConnections}
            >
              <span className='i-lucide-unlink flex' /> Clear connections
            </button>
          </li>
          <hr className='border-t-[--node-border-color]' />
        </div>
        <div className='overflow-hidden'>
          <li
            className={clsx(
              'mt-2',
              { '!opacity-0 !h-0': !hideDelete}
            )}
          >
            <button
              className='flex items-center justify-center gap-2 text-red-600 w[100%] p-1 rounded-[4px]'
              onClick={() => setHideDelete(false)}
            >
              <span className='i-lucide-trash2 flex' /> Clear nodes
            </button>
          </li>
          <li
            className={clsx(
              'justify-between mt-2 opacity-0 transition-all duration-300 h-0 translate-y-10',
              { 'flex opacity-100 h-auto !translate-y-0': hideDelete === false },
            )}
          >
            <button className='flex items-center rounded-4px bg-red-600 p-1 text-[#EEEFEF]' onClick={deleteNodes}>
              Yes, Delete
            </button>
            <button
              className='flex items-center rounded-4px border border-[--node-border-color] p-1 text-[#222428] dark:text-[#EEEFEF]'
              onClick={() => setHideDelete(true)}
            >
              Cancel
            </button>
          </li>
        </div>
      </ul>
    </div>
  )
})
