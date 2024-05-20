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
import globalNodeState from '~/state/nodesState'

interface Props extends HandleProps {
  className?: string
}

const selector = (s) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges
})

function NodeHandle({ className, ...props }: Props) {
  const isSourceConnected = useStore((s) =>
    s.edges.some((edge) => edge.source === props.id)
  )
  const reactflow = useReactFlow()

  const nodeId = useNodeId()

  const { nodeInternals, edges } = useStore(selector)

  //TODO: adding connection limit functionality

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
          const edges = getConnectedEdges([reactflow.getNode(connection.target)!], reactflow.getEdges());
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

  // const isHandleConnectable = React.useMemo(() => {
  //   const node = nodeInternals.get(nodeId)
  //   const connectedEdges = getConnectedEdges([node], edges)
  //   console.log(connectedEdges)

  //   if (connectedEdges.length > 1) {
  //     return false;
  //   }

  //   return true
  // }, [nodeInternals, edges, nodeId])

  const onConnect = (connection: Connection) => {
    switch (connection.sourceHandle) {
      case 'style-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.target) {
            node.data = {
              ...node.data,
              styleNodeConnected: true,
              styleNodeId: node.id
            }
          }
        })
        break
      case 'content-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.target) {
            node.data = {
              ...node.data,
              contentNodeConnected: true,
              contentNodeId: node.id
            }
          }
        })
        break
      case 'model-node':
        globalNodeState.value.map((node) => {
          if (node.id === connection.source) {
            node.data = {
              ...node.data,
              displayNodeConnected: true,
              displayNodeId: connection.target
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
