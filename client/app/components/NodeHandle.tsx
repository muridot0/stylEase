import clsx from 'clsx'
import React from 'react'
import {
  Handle,
  Position,
  useStore,
  useReactFlow
} from 'reactflow'
import type { Connection, HandleProps, ReactFlowState } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

function NodeHandle({ className, ...props }: Props) {
  const isSourceConnected = useStore(s => s.edges.some((edge) => edge.source === props.id))
  const isTargetConnected = useStore(s => s.edges.some((edge) => edge.target === props.id))
  console.log(isSourceConnected)

  function isValidHandle(connection: Connection) {
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
      isValidConnection={isValidHandle}
      isConnectableStart={isSourceConnected ? false : true}
      isConnectableEnd={isTargetConnected ? false : true}
      // isConnectable={isHandleConnectable}
    ></Handle>
  )
}

export default NodeHandle
