import clsx from 'clsx'
import React from 'react'
import { BackgroundVariant, useReactFlow } from 'reactflow'
import RadioItemWithProvider from './RadioItem'
import setRef from '~/lib/setRef'
import { initialEdges, initialNodes } from '~/state/nodesState'
import { db } from '~/lib/db'

interface Props {
  toggleMenu: boolean
  showMenu: () => void
}

export default React.forwardRef(function ContextMenu(
  { toggleMenu, showMenu }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const contextRef = React.useRef<HTMLDivElement>(null)
  const [hideDelete, setHideDelete] = React.useState(true)
  const [animationFinished, setAnimationFinished] = React.useState(true)

  const reactflow = useReactFlow()

  React.useEffect(() => {
    if (hideDelete) return
    setHideDelete(toggleMenu)
    setAnimationFinished(true)
  }, [toggleMenu])

  const deleteNodes = () => {
    setTimeout(() => setAnimationFinished(true), 200)
    setHideDelete(true)
    const nodes = reactflow.getNodes()
    const edges = reactflow.getEdges()
    reactflow.deleteElements({ nodes, edges })
    db.flow.clear()
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
        className='border bg-[--drawer-color] backdrop-blur-[--blur] border-[--node-border-color] hover:bg-[--hover-bg-color] hover:text-[--hover-color] p-2 rounded-[50%]'
        onClick={showMenu}
        title='Toggle menu'
      >
        <span className='i-lucide-sliders-horizontal flex text-2xl' />
        <span className='sr-only'>Menu</span>
      </button>
      <ul
        className={clsx(
          'overflow-hidden absolute mt-2 backdrop-blur-[--blur] right-8 border bg-[--drawer-color] border-[--node-border-color] w-[12.5rem] h-[17.5rem] p-4 rounded-[8px] transition-opacity ease-in-out',
          { 'hidden': !toggleMenu }
        )}
      >
        <div className='mb-2'>
          <div className="flex items-center mb-2 gap-2">
            <h2 className='font-semibold text-sm opacity-50'>Background</h2>
            <hr className='w-full border-t-[--primary] opacity-40' />
          </div>
          {(Object.keys(BackgroundVariant) as Array<BackgroundVariant>).map(
            (key) => (
              <RadioItemWithProvider value={key} key={key} />
            )
          )}
        </div>
        <div className='overflow-hidden'>
        <div className="flex items-center mb-2 gap-2">
            <h2 className='font-semibold text-sm opacity-50'>Actions</h2>
            <hr className='w-full border-t-[--primary] opacity-40' />
          </div>
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
          <hr className='border-t-[--primary] opacity-40' />
        </div>
        <div className='overflow-hidden'>
          <li
            className={clsx(
              'h-0 opacity-0',
              { 'mt-3 !h-auto opacity-100': animationFinished },
              { 'hidden': !hideDelete }
            )}
          >
            <button
              className='flex items-center justify-center gap-2 text-red-500 w[100%] p-1 rounded-[4px]'
              onClick={() => {
                setAnimationFinished(false)
                setHideDelete(false)
              }}
            >
              <span className='i-lucide-trash2 flex' /> Clear nodes
            </button>
          </li>
          <li
            className={clsx(
              'flex justify-between transition-all duration-200 translate-y-10',
              { 'h-0': animationFinished },
              { 'transition-all h-auto duration-200 !translate-y-0 mt-3': hideDelete === false }
            )}
          >
            <button
              className='flex items-center rounded-4px bg-red-600 p-1 text-[#EEEFEF]'
              onClick={deleteNodes}
            >
              Yes, Delete
            </button>
            <button
              className='flex items-center rounded-4px border border-[--node-border-color] p-1 text-[#222428] dark:text-[#EEEFEF]'
              onClick={() => {
                setTimeout(() => {
                  setAnimationFinished(true)
                }, 200)
                setHideDelete(true)
              }}
            >
              Cancel
            </button>
          </li>
        </div>
      </ul>
    </div>
  )
})
