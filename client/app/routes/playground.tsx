import type { MetaFunction } from '@remix-run/node'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  Connection
} from 'reactflow'

import 'reactflow/dist/style.css'
import { MODEL_NODE_TYPE, NodeDrawer } from '~/components'
import nodeTypes from '~/lib/nodetypes'
import randomStr from '~/lib/randomStr'
import { CustomNode } from '~/state/nodesState'

const initialNodes = [
  {
    id: '1',
    type: 'style-node-type',
    position: { x: 500, y: 200 },
    data: {
      title: 'Style Node',
      icon: 'i-lucide-image-plus',
      id: `style-node-${randomStr(10)}`
    }
  },
  {
    id: '2',
    type: 'model-node-type',
    position: { x: 800, y: 200 },
    data: {
      title: 'Style Transfer Node',
      icon: 'i-lucide-brain-cog',
      id: `model-node-${randomStr(10)}`
    }
  },
  {
    id: '3',
    type: 'display-node-type',
    position: { x: 1100, y: 200 },
    data: {
      title: 'Display Node',
      icon: 'i-lucide-aperture',
      id: `display-node-${randomStr(10)}`
    }
  }
]

const initialEdges = [
  { id: 'e1-2', source: '1', sourceHandle: '1', target: '2' },
  { id: 'e2-3', source: '2', sourceHandle: '2', target: '3' }
]

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export default function Playground() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }

  const addNode = (data: CustomNode) => {
    // TODO: hook up node array signal to this function
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

  return (
    <div className='h-screen w-screen'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <NodeDrawer onSelect={addNode} />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  )
}
