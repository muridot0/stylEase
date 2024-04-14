import type { MetaFunction } from '@remix-run/node'
import React from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant
} from 'reactflow'

import 'reactflow/dist/style.css'
import NodeDrawer from '~/components/NodeDrawer'
import nodeTypes from '~/lib/nodetypes'
import randomStr from '~/lib/randomStr'

const initialNodes = [
  {
    id: '1',
    type: 'style-node-type',
    position: { x: 200, y: 200 },
    data: {
      title: 'Style Node',
      icon: 'i-lucide-image-plus',
      id: `style-node-${randomStr(10)}`
    }
  },
  {
    id: '2',
    type: 'display-node-type',
    position: { x: 500, y: 200 },
    data: {
      title: 'Display Node',
      icon: 'i-lucide-view',
      id: `display-node-${randomStr(10)}`
    }
  }
]

const initialEdges = [
  { id: 'e1-2', source: '1', sourceHandle: 'a', target: '2' }
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

  const onConnect = React.useCallback(
    (params: any) => {
      console.log(params)
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const addNode = (id: string) => {
    setNodes((nodes) => [
      ...nodes,
      {
        data: {id: id, title: 'hey', icon: 'hey'},
        position: {x: 100, y: 200},
        type: 'sh',
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
        <NodeDrawer onSelect={addNode}/>
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  )
}
