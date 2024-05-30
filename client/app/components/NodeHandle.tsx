import React from 'react'
import clsx from 'clsx'
import {
  Handle,
  Position,
  getConnectedEdges,
  useNodeId,
  useReactFlow,
  useStore
} from 'reactflow'
import type { Connection, HandleProps } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges
})

function NodeHandle({ className, ...props }: Props) {
  const isSourceConnected = useStore((s) =>
    s.edges.some((edge) => edge.source === props.id)
  )
  const reactflow = useReactFlow()

  function isValidHandle(connection: Connection) {
    switch (connection.sourceHandle) {
      case 'style-node':
        if(connection.target) {
          const edges = getConnectedEdges([reactflow.getNode(connection.target)!], reactflow.getEdges());
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].sourceHandle === connection.sourceHandle || edges[i].targetHandle === connection.targetHandle) {
              return false;
            }
          }
        }

        return connection.targetHandle === 'style-input'
      case 'content-node':
        if(connection.target) {
          const edges = getConnectedEdges([reactflow.getNode(connection.target)!], reactflow.getEdges());
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].sourceHandle === connection.sourceHandle || edges[i].targetHandle === connection.targetHandle) {
              return false;
            }
          }
        }

        return connection.targetHandle === 'content-input'
      case 'model-node':
        if(connection.target) {
          const edges = getConnectedEdges([reactflow.getNode(connection.source!)!], reactflow.getEdges());
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].sourceHandle === connection.sourceHandle || edges[i].targetHandle === connection.targetHandle) {
              return false;
            }
          }
        }
        return connection.targetHandle === 'model-input'
      default:
        return connection.source !== connection.target
    }
  }

  const onConnect = (connection: Connection) => {
    switch (connection.sourceHandle) {
      case 'style-node':
        reactflow.setNodes((nodes)  => {
          nodes.forEach((node) => {
            if (node.id === connection.target) {
              node.data = {
                ...node.data,
                styleNodeConnected: true,
                styleNodeId: connection.source
              }
            }
          })
          return nodes
        })
        break
      case 'content-node':
        reactflow.setNodes((nodes) => {
          nodes.map((node) => {
            if (node.id === connection.target) {
              node.data = {
                ...node.data,
                contentNodeConnected: true,
                contentNodeId: connection.source
              }
            }
          })
          return nodes
        })
        break
      case 'model-node':
        reactflow.setNodes((nodes) => {
          nodes.map((node) => {
            if (node.id === connection.source) {
              node.data = {
                ...node.data,
                displayNodeConnected: true,
                displayNodeId: connection.target
              }
            }
          })
          return nodes
        })
        break
    }
  }

  return (
    <Handle
      {...props}
      className={clsx(
        '!transform-none !pointer-events-auto handle',
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
