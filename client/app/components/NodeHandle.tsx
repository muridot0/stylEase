import React from 'react'
import clsx from 'clsx'
import { Handle, Position, useStore } from 'reactflow'
import type { Connection, HandleProps } from 'reactflow'
import globalNodeState from '~/state/nodesState'

interface Props extends HandleProps {
  className?: string
}

function NodeHandle({ className, ...props }: Props) {
  const isSourceConnected = useStore((s) =>
    s.edges.some((edge) => edge.source === props.id)
  )

  function isValidHandle(connection: Connection) {
    switch (connection.sourceHandle) {
      case 'style-node':
        return connection.targetHandle === 'style-input'
      case 'content-node':
        return connection.targetHandle === 'content-input'
      case 'model-node':
        return connection.targetHandle === 'model-input'
      default:
        return connection.source !== connection.target
    }
  }

  const onConnect = (connection: Connection) => {
    switch (connection.sourceHandle) {
      case 'style-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.target) {
            node.data = {
              ...node.data,
              styleNodeConnected: true
            }
          }
        })
        break
      case 'content-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.target) {
            node.data = {
              ...node.data,
              contentNodeConnected: true
            }
          }
        })
        break
      case 'model-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.source) {
            node.data = {
              ...node.data,
              displayNodeConnected: true
            }
          }
        })
        break
    }
  }

  return (
    <Handle
      {...props}
      className={clsx(
        '!transform-none !pointer-events-auto',
        {
          '!left-0 !rounded-none !border-t-4 !border-b-4 !border-l-8 !border-t-transparent !border-b-transparent !border-l-[--node-handle-color] !dark:border-l-[#6B7077] no-bg':
            props.position !== Position.Right,
          '!right-[-0.125rem] !border-none !w-[7px] !h-[7px] !top-[1.65rem] z-2 !bg-[--node-handle-color]':
            props.position === Position.Right
        },
        className
      )}
      isValidConnection={isValidHandle}
      onConnect={onConnect}
      isConnectableStart={
        props.type === 'target' ? false : isSourceConnected ? false : true
      }
    ></Handle>
  )
}

export default NodeHandle
