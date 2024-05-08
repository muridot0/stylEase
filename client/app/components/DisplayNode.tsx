import type { NodeProps } from 'reactflow'
import WrapperNode from './WrapperNode'
import { Position, useReactFlow } from 'reactflow'
import Attachment from './Attachment'
import React from 'react'

interface Props {
  title: string
  icon: string
}

export default React.memo(function DisplayNode({ data, selected, ...props }: NodeProps<Props>) {
  //TODO: start working on functionality next
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reactflow = useReactFlow()

  const node = reactflow.getNodes()
  React.useEffect(() => {

    //TODO: display image here as canvas
    if(!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    console.log(node[0].data)

  },[node])

  return (
    <WrapperNode
      nodeTitle={data.title}
      iconClass={data.icon}
      position={Position.Left}
      selected={selected}
      nodeId={props.id}
    >
      <Attachment nodeId={props.id} label='display node' attachmentType='preview' ref={canvasRef} />
    </WrapperNode>
  )
})

