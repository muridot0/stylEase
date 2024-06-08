import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import { NodeProps, Position } from 'reactflow'
import React from 'react'
import { useReactFlow } from 'reactflow'
import { STYLE_NODE_TYPE, CONTENT_NODE_TYPE, MODEL_NODE_TYPE, DISPLAY_NODE_TYPE } from '~/state/nodesState'

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
  const hoverRef = React.useRef<HTMLDivElement>(null)
  const reactflow = useReactFlow()

  const node = reactflow.getNode(nodeId)

  const findType = () => {
    return node?.type === STYLE_NODE_TYPE
      ? 'style-node'
      : node?.type === CONTENT_NODE_TYPE
        ? 'content-node'
        : node?.type === MODEL_NODE_TYPE
          ? 'model-node'
          : node?.type === DISPLAY_NODE_TYPE
            ? 'display-node'
            : undefined
  }

  const renderHandles = () => {
    switch (position) {
      case 'left':
        return <NodeHandle id="model-input" type='target' position={Position.Left} />
      case 'right':
        return (
          <NodeHandle id={findType()} type='source' position={Position.Right} />
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

  const checkHover = () => {
    if (!hoverRef.current) return

    const rect = hoverRef.current.getBoundingClientRect()
    const isInElement = (
      window.innerWidth > rect.left &&
      window.innerHeight > rect.top &&
      rect.right > 0 &&
      rect.bottom > 0
    )

    if (!isInElement) {
      setHovering(false)
    } else {
      requestAnimationFrame(checkHover)
    }
  }

  React.useEffect(() => {
    if (hovering) {
      requestAnimationFrame(checkHover)
    }
  }, [hovering])

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
      ref={hoverRef}
    >
      <div
        className={clsx(
          className,
          'relative w-full min-w-[200px] backdrop-blur-[--blur] bg-[--node-bg-color] border border-[--node-border-color] py-6 px-10 rounded-[8px] text-center',
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
        <div className='flex gap-2 bg-transparent w-fit mt-[0.3rem] rounded-[8px] pt-1'>
          <button
            className='flex border items-center bg-[--drawer-color] backdrop-blur-[--blur] border-[--node-border-color] p-1 rounded-1 hover:(bg-[--hover-bg-color] text-[--hover-color])'
            onClick={deleteEdges}
            title='Delete connections'
          >
            <span className='i-lucide-unlink flex' />
            <span className='sr-only'>Delete node connections</span>
          </button>
          <button
            className='flex border items-center bg-[--drawer-color] backdrop-blur-[--blur] border-[--node-border-color] p-1 rounded-1 hover:(bg-[--hover-bg-color] text-[--hover-color])'
            onClick={deleteNode}
            title='Delete node'
          >
            <span className='i-lucide-trash-2 flex' />
            <span className='sr-only'>Delete node</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default WrapperNode
