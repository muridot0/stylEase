import { signal } from '@preact/signals'
import clsx from 'clsx'
import React from 'react'
import { Handle, Position, useReactFlow, useStore } from 'reactflow'
import type { Connection, HandleProps } from 'reactflow'
import globalNodeState from '~/state/nodesState'

interface Props extends HandleProps {
  className?: string
}

function NodeHandle({ className, ...props }: Props) {
  const reactflow = useReactFlow()
  const isSourceConnected = useStore((s) =>
    s.edges.some((edge) => edge.source === props.id)
  )
  const isTargetConnected = useStore((s) =>
    s.edges.some((edge) => edge.target === props.id)
  )

  function isValidHandle(connection: Connection) {
    //TODO: add functionality to remove the style when edge is disconnected
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
        return connection.targetHandle === 'style-input'
      case 'content-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.target) {
            node.data = {
              ...node.data,
              contentNodeConnected: true
            }
          }
        })
        return connection.targetHandle === 'content-input'
      case 'model-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.source) {
            node.data = {
              ...node.data,
              displayNodeConnected: true
            }
          }
        })
        return connection.targetHandle === 'model-input'
      default:
        return connection.source !== connection.target
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
      isConnectableStart={
        props.type === 'target' ? false : isSourceConnected ? false : true
      }
    ></Handle>
  )
}

export default NodeHandle
