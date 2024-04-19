import clsx from 'clsx'
import React from 'react'
import {
  Handle,
  Position,
  getConnectedEdges,
  useNodeId,
  useStore,
  useReactFlow
} from 'reactflow'
import type { Connection, HandleProps, ReactFlowState } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

// const selector = (s: ReactFlowState) => ({
//   nodeInternals: s.nodeInternals,
//   edges: s.edges
// })

function NodeHandle({ className, ...props }: Props) {
  // const { nodeInternals, edges } = useStore(selector)
  // const nodeId = useNodeId()
  const reactflow = useReactFlow()

  // const isHandleConnectable = React.useMemo(() => {
  //   const node = nodeInternals.get(nodeId!)
  //   const connectedEdges = getConnectedEdges([node!], edges)

  //   // const edgesOnNode = reactflow.getEdges().filter((edge) => edge.target === nodeId)
  //   // console.log(edgesOnNode, node)

  //   //TODO: issue is model nodes have more than 1 handle
  //   //another issue is that when you allow 2 for model node the user can connect 2 edges
  //   //so probably look into using edge id to also restrict
  //   console.log(node)
  //   if (node!.type === 'model-node-type') {
  //     if (connectedEdges.length > 2 && props.type === 'target') {
  //       return false
  //     }
  //   }

  //   if (connectedEdges.length > 1 && props.type === 'target') {
  //     return false
  //   }

  //   return true

  //   // if (connectedEdges.length > 1) return false

  // }, [nodeInternals, edges, nodeId])

  const handleOnConnect = (params: Connection) => {
    console.log(params, reactflow.getEdges())
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
      // isConnectable={isHandleConnectable}
      onConnect={handleOnConnect}
    ></Handle>
  )
}

export default NodeHandle
