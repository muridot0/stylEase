import { signal } from '@preact/signals'
import clsx from 'clsx'
import { Handle, Position, useStore } from 'reactflow'
import type { Connection, HandleProps } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

const modelNodeSignal = signal({
  styleNodeConnected: false,
  contentNodeConnected: true
})

function NodeHandle({ className, ...props }: Props) {
  const isSourceConnected = useStore((s) =>
    s.edges.some((edge) => edge.source === props.id)
  )
  const isTargetConnected = useStore((s) =>
    s.edges.some((edge) => edge.target === props.id)
  )

  function isValidHandle(connection: Connection) {
    if(connection.sourceHandle === 'style-node'){
      modelNodeSignal.value.styleNodeConnected = true
      console.log(modelNodeSignal)
      return connection.targetHandle === 'style-input'
    }
    return connection.source !== connection.target
  }

  return (
    <Handle
      {...props}
      className={clsx(
        '!transform-none',
        {
          '!left-0 !rounded-none !border-t-4 !border-b-4 !border-l-8 !border-t-transparent !border-b-transparent !border-l-[--node-handle-color] !dark:border-l-[#6B7077] no-bg':
            props.position !== Position.Right,
          '!right-[-0.125rem] !border-none !w-[7px] !h-[7px] !top-[1.65rem] z-2 !bg-[--node-handle-color]':
            props.position === Position.Right
        },
        className
      )}
      isValidConnection={props.isValidConnection ? props.isValidConnection : isValidHandle}
      isConnectableStart={
        props.type === 'target' ? false : isSourceConnected ? false : true
      }
    ></Handle>
  )
}

export default NodeHandle
