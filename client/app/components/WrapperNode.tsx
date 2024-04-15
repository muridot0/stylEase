import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import { Position } from 'reactflow'
import React from 'react'

interface Props extends React.PropsWithChildren {
  nodeTitle: string
  className?: string
  iconClass?: string
  position: Position
  selected: boolean
  onHover: (id: string) => void
}

function WrapperNode({
  children,
  className,
  iconClass,
  nodeTitle,
  position,
  selected,
  onHover
}: Props) {
  const [hovering, setHovering] = React.useState(false)

  //TODO: add functionality to delete node (should show delete icon on hover)
  const renderHandles = () => {
    switch (position) {
      case 'left':
        return <NodeHandle type='target' position={Position.Left} />
      case 'right':
        return <NodeHandle id='a' type='source' position={Position.Right} />
      default:
        return null
    }
  }

  const handleHover = () => {
    setHovering(!hovering)
  }

  const handleStopHovering = () => {
    setHovering(!hovering)
  }

  return (
    <div
      className='flex flex-col items-end'
      onMouseEnter={handleHover}
      onMouseLeave={handleStopHovering}
    >
      <div
        className={clsx(
          className,
          'relative w-full min-w-[200px] bg-[--node-bg-color] border border-[--node-border-color] py-6 px-10 rounded-[8px] text-center',
          { 'dark:border-[#b3b3b3] light:border-[#808080]': selected }
        )}
      >
        <section className='flex items-center gap-2 mb-4 justify-center'>
          {iconClass && (
            <span
              className={clsx(iconClass, 'flex text-[--node-icons-color]')}
            />
          )}
          <h1>{nodeTitle}</h1>
        </section>

        {renderHandles()}

        {children}
      </div>

      {hovering && (
        <div className='flex gap-2 w-fit border border-[--node-border-color] mt-1 bg-[--node-bg-color] rounded-[8px] px-2 py-1'>
          <button className='flex border border-[--node-border-color] p-1 rounded-1 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'>
            <span className='i-lucide-unlink text-xs'></span>
          </button>
          <button className='flex border border-[--node-border-color] p-1 rounded-1 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'>
            <span className='i-lucide-trash-2 text-xs'></span>
          </button>
        </div>
      )}
    </div>
  )
}

export default WrapperNode
