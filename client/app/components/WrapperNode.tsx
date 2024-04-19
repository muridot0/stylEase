import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import { Position } from 'reactflow'
import React from 'react'
import { useReactFlow } from 'reactflow'

interface Props extends React.PropsWithChildren {
  nodeTitle: string
  className?: string
  iconClass?: string
  position: Position
  selected: boolean
  nodeId: string
}

function WrapperNode({
  children,
  className,
  iconClass,
  nodeTitle,
  position,
  selected,
  nodeId
}: Props) {
  const [hovering, setHovering] = React.useState(false)
  const reactflow = useReactFlow()

  const node = reactflow.getNode(nodeId)

  const findId = () => {
    return node?.type === 'style-node-type'
      ? 'style-node'
      : node?.type === 'content-node-type'
        ? 'content-node'
        : node?.type === 'model-node-type'
          ? 'model-node'
          : undefined
  }

  const renderHandles = () => {
    switch (position) {
      case 'left':
        return <NodeHandle type='target' position={Position.Left} />
      case 'right':
        return (
          <NodeHandle id={findId()} type='source' position={Position.Right} />
        )
      default:
        return null
    }
  }

  const handleHover = () => {
    setHovering(true)
  }

  const handleStopHovering = () => {
    setHovering(false)
  }

  const deleteNode = () => {
    reactflow.deleteElements({ nodes: [{ id: nodeId }] })
  }

  const filterEdges = () => {
    const node = reactflow.getNode(nodeId)

    return reactflow
      .getEdges()
      .filter((edge) => node?.id === edge.source || node?.id === edge.target)
  }

  const deleteEdges = () => {
    reactflow.deleteElements({ edges: filterEdges() })
  }

  return (
    <div
      className='flex flex-col items-end relative'
      onMouseEnter={handleHover}
      onMouseLeave={handleStopHovering}
    >
      <div
        className={clsx(
          className,
          'relative w-full min-w-[200px] bg-[--node-bg-color] border border-[--node-border-color] py-6 px-10 rounded-[8px] text-center',
          { 'border-[--stroke-color]': selected }
        )}
      >
        <section className='flex items-center gap-2 mb-4 justify-center'>
          {iconClass && (
            <span
              className={clsx(iconClass, 'flex text-[--node-icons-color]')}
            />
          )}
          <h1 className='text-xl font-semibold'>{nodeTitle}</h1>
        </section>

        {renderHandles()}

        {children}
      </div>

      {hovering && (
        <div className='flex gap-2 bg-transparent w-fit  mt-1 rounded-[8px] px-2 py-1'>
          <button
            className='flex border bg-[--node-bg-color] border-[--node-border-color] p-1 rounded-1 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'
            onClick={deleteEdges}
          >
            <span className='i-lucide-unlink text-xs'></span>
          </button>
          <button
            className='flex border bg-[--node-bg-color] border-[--node-border-color] p-1 rounded-1 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'
            onClick={deleteNode}
          >
            <span className='i-lucide-trash-2 text-xs'></span>
          </button>
        </div>
      )}
    </div>
  )
}

export default WrapperNode
