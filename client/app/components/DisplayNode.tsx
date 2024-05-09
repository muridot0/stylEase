import type { NodeProps, ReactFlowJsonObject } from 'reactflow'
import WrapperNode from './WrapperNode'
import { Position, useReactFlow } from 'reactflow'
import React from 'react'
import base64ToImageData from '~/lib/base64ToImageData'
import Preview from './Preview'

interface Props {
  title: string
  icon: string
}

export default React.memo(function DisplayNode({ data, selected, ...props }: NodeProps<Props>) {
  //TODO: start working on functionality next
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reactflow = useReactFlow()

  const flowData = localStorage.getItem('stylEase')

  if (!flowData) return

  const parsedFlow: ReactFlowJsonObject = JSON.parse(flowData)
  React.useEffect(() => {

    const { nodes } = parsedFlow

    if(!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')



    if(!nodes[0]?.data?.content?.url) return
    console.log(nodes[0].data.content.url)
    const data = base64ToImageData(nodes[0].data.content.url)
    console.log(data)
    canvasRef.current.width = data.width
    canvasRef.current.height = data.height


    ctx?.putImageData(data.imageData!, 0, 0)

  },[parsedFlow])

  return (
    <WrapperNode
      nodeTitle={data.title}
      iconClass={data.icon}
      position={Position.Left}
      selected={selected}
      nodeId={props.id}
    >
      <Preview nodeId={props.id} label='display node' ref={canvasRef} />
    </WrapperNode>
  )
})

