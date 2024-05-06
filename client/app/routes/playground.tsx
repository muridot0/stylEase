import type { MetaFunction } from '@remix-run/node'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
  ReactFlowJsonObject,
} from 'reactflow'

import 'reactflow/dist/style.css'
import 'react-toastify/dist/ReactToastify.css'

import {
  NodeDrawer,
  Header
} from '~/components'
import nodeTypes from '~/lib/nodetypes'
import randomStr from '~/lib/randomStr'
import backgroundState from '~/state/backgroundState'
import globalNodeState, { CustomNode, initialEdges, initialNodes } from '~/state/nodesState'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

//TODO: work on holding the data in local storage so that data persists on refresh
export default function Playground() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [background, setBackground] = React.useState<
    BackgroundVariant | undefined
  >()
  const [flowInstance, setFlowInstance] = React.useState<ReactFlowInstance>()

  React.useEffect(() => {
    backgroundState.subscribe((value) => {
      setBackground(value)
    })
  }, [backgroundState.value])

  React.useEffect(() => {
    globalNodeState.value = nodes
  }, [nodes])

  React.useEffect(() => {
    if (!flowInstance) return
    const flow = flowInstance.toObject()
    localStorage.setItem('stylEase', JSON.stringify(flow))
  }, [nodes, edges])

  React.useEffect(() => {
    const existingFlow = localStorage.getItem('stylEase')

    if (!existingFlow) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      return
    }
    const parsedExistingFlow: ReactFlowJsonObject = JSON.parse(existingFlow)

    const { nodes, edges } = parsedExistingFlow

    setNodes(nodes)
    setEdges(edges)
  }, [])

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
    //force a rerender everytime a node is connected
    const newNodes = [...nodes]
    setNodes(newNodes)
  }

  const addNode = (data: CustomNode) => {
    setNodes((nodes) => [
      ...nodes,
      {
        data: { id: data.id, title: data.title, icon: data.icon },
        position: { x: 300, y: 200 },
        type: data.type,
        id: randomStr()
      }
    ])
  }

  const handleEdgeDelete = (edges: Edge[]) => {
    edges.map((edge): void => {
      if (edge.targetHandle === 'style-input') {
        setNodes((nodes) => {
          return nodes.map((node) => {
            if (edge.target === node.id) {
              node.data = {
                ...node.data,
                styleNodeConnected: false
              }
            }
            return node
          })
        })
      } else if (edge.targetHandle === 'content-input') {
        setNodes((nodes) => {
          return nodes.map((node) => {
            if (edge.target === node.id) {
              node.data = {
                ...node.data,
                contentNodeConnected: false
              }
            }
            return node
          })
        })
      } else if (edge.targetHandle === 'model-input') {
        setNodes((nodes) => {
          return nodes.map((node) => {
            if (edge.source === node.id) {
              node.data = {
                ...node.data,
                displayNodeConnected: false
              }
            }
            return node
          })
        })
      }
    })
  }

  return (
    <>
      <div className='h-screen w-screen'>
        <ReactFlowProvider>
          <Header />
          <ToastContainer limit={1}/>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={handleEdgeDelete}
            snapToGrid={true}
            onInit={setFlowInstance}
          >
            <NodeDrawer onSelect={addNode} />
            <Background
              variant={background}
              gap={15}
              className='[&>path]:[&>pattern]:stroke-[--node-border-color]'
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </>
  )
}
