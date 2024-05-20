import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
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
  NodeChange
} from 'reactflow'

import 'reactflow/dist/style.css'

import { NodeDrawer, Header } from '~/components'
import { db } from '~/lib/db'
import nodeTypes from '~/lib/nodetypes'
import randomStr from '~/lib/randomStr'
import backgroundState from '~/state/backgroundState'
import globalNodeState, {
  CustomNode,
  MODEL_NODE_TYPE,
  initialEdges,
  initialNodes
} from '~/state/nodesState'

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
    db.flow.add(flow, 1)
  }, [nodes, edges])

  const flow = useLiveQuery(async () => await db.flow.toArray())
  console.log(flow)

  React.useEffect(() => {
    if (!flow) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      return
    }

    flow.map((val): void => {
      setNodes(val.nodes)
      setEdges(val.edges)
    })

    // if (flow) {
    //   const parse: ReactFlowJsonObject = JSON.parse(flow[0])
    //   console.log(parse)

    //   const { nodes, edges } = parse

    //   setNodes(nodes)
    //   setEdges(edges)
    // }
    // const existingFlow = localStorage.getItem('stylEase')

    // const parsedExistingFlow: ReactFlowJsonObject = JSON.parse(existingFlow)

    // const { nodes, edges } = parsedExistingFlow

    // setNodes(nodes)
    // setEdges(edges)
  }, [])

  //Sets the image data for model node
  React.useEffect(() => {
    globalNodeState.value.map((node): void => {
      if (node.type === MODEL_NODE_TYPE) {
        const styleNode = nodes.find((val) => node.data.styleNodeId === val.id)
        node.data.styleImage = {
          ...styleNode?.data.content!
        }
        const contentNode = nodes.find(
          (val) => node.data.contentNodeId === val.id
        )
        node.data.contentImage = {
          ...contentNode?.data.content!
        }
      }
    })
  }, [globalNodeState.value])

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
        data: {
          id: data.id,
          title: data.title,
          icon: data.icon,
          uploadMsg: data.uploadMsg
        },
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
                styleNodeConnected: false,
                styleNodeId: null
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
                contentNodeConnected: false,
                contentNodeId: null
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
                displayNodeConnected: false,
                displayNodeId: null
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
