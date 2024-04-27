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
  STYLE_NODE_TYPE,
  DISPLAY_NODE_TYPE,
  CONTENT_NODE_TYPE,
  MODEL_NODE_TYPE,
  NodeDrawer,
  Header
} from '~/components'
import nodeTypes from '~/lib/nodetypes'
import randomStr from '~/lib/randomStr'
import backgroundState from '~/state/backgroundState'
import globalNodeState, { CustomNode } from '~/state/nodesState'

const initialNodes = [
  {
    id: '1',
    type: STYLE_NODE_TYPE,
    position: { x: 490, y: 223 },
    data: {
      title: 'Style Node',
      icon: 'i-lucide-image-plus',
      id: `style-node-${randomStr(10)}`
    }
  },
  {
    id: '2',
    type: CONTENT_NODE_TYPE,
    position: { x: 490, y: 532 },
    data: {
      title: 'Content Node',
      icon: 'i-lucide-paintbrush',
      id: `style-node-${randomStr(10)}`
    }
  },
  {
    id: '3',
    type: MODEL_NODE_TYPE,
    position: { x: 813, y: 379 },
    data: {
      title: 'Style Transfer Node',
      icon: 'i-lucide-brain-cog',
      id: `model-node-${randomStr(10)}`,
      styleNodeConnected: true,
      contentNodeConnected: true,
      displayNodeConnected: true
    }
  },
  {
    id: '4',
    type: DISPLAY_NODE_TYPE,
    position: { x: 1133, y: 352 },
    data: {
      title: 'Display Node',
      icon: 'i-lucide-aperture',
      id: `display-node-${randomStr(10)}`
    }
  }
]

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    sourceHandle: '1',
    target: '3',
    targetHandle: 'style-input'
  },
  {
    id: 'e2-3',
    source: '2',
    sourceHandle: '2',
    target: '3',
    targetHandle: 'content-input'
  },
  {
    id: 'e3-4',
    source: '3',
    sourceHandle: '3',
    target: '4',
    targetHandle: 'model-input'
  }
]

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
