import type { MetaFunction } from '@remix-run/node'
import React from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background
} from 'reactflow'
import InputNode from '../components/InputNode'

import 'reactflow/dist/style.css'

const initialNodes = [
  {
    id: '1',
    type: 'inputNode',
    position: { x: 50, y: 50 },
    data: { label: '1' }
  }
]
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

const nodeTypes = { inputNode: InputNode }

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export default function Playground() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const onConnect = React.useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges],
  // );

  return (
    <div className='h-screen w-screen'>
      <ReactFlow
        nodes={nodes}
        // edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
      >
        <Background variant='dots' />
      </ReactFlow>
    </div>
  )
}
