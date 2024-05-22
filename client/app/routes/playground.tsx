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
  getIncomers,
  getConnectedEdges,
} from 'reactflow'

import 'reactflow/dist/style.css'

import { NodeDrawer, Header } from '~/components'
import { db } from '~/lib/db'
import nodeTypes from '~/lib/nodetypes'
import backgroundState from '~/state/backgroundState'
import globalNodeState, {
  CustomNode,
  DISPLAY_NODE_TYPE,
  MODEL_NODE_TYPE,
  initialEdges,
  initialNodes
} from '~/state/nodesState'

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
  }, [setNodes, nodes])

  React.useEffect(() => {
    if (!flowInstance) return
    const flow = flowInstance.toObject()

    db.flow.put(flow, 1)
  }, [nodes, edges])

  // db.flow.get(1).then((val) => {
  //   console.log(val?.nodes)
  // })

  const restoreNodes = React.useCallback(async () => {
    const flow = await db.flow.get(1)

    if (!flow) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      return
    }
    setNodes(flow.nodes)
    setEdges(flow.edges)
  }, [setNodes, setEdges])

  React.useEffect(() => {
    restoreNodes()
  }, [restoreNodes])

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

  // const fetchStylizedImage = React.useCallback(async () => {
  //   globalNodeState.value.map(async (node) => {
  //     if(node.type === DISPLAY_NODE_TYPE){
  //       const incommers = getIncomers(
  //         node,
  //         nodes,
  //         edges
  //       )

  //       const dbResult = await db.imagedata.get(incommers[0].data.id)
  //       if(!dbResult) return
  //       console.log('called')
  //       node.data.content = {
  //         ...dbResult.data
  //       }
  //     }
  //   })
  // }, [setNodes, setEdges])

  // React.useEffect(() => {fetchStylizedImage()}, [fetchStylizedImage])

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
    //force a rerender everytime a node is connected
    const newNodes = [...nodes]
    setNodes(newNodes)
  }

  const addNode = (data: CustomNode) => {
    //TODO: add styleNodeId and contentNodeId to model nodes
    //Could use the type from data for model node types

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
        id: data.id.split('-')[2]
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
          nodes.map((node) => {
            if (edge.source === node.id) {
              node.data = {
                ...node.data,
                displayNodeConnected: false,
                displayNodeId: null
              }
            }
            return node
          })
          return nodes
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
