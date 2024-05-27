import type { NodeProps, ReactFlowJsonObject } from 'reactflow'
import WrapperNode from './WrapperNode'
import { Position } from 'reactflow'
import React from 'react'
import Preview from './Preview'

interface Props {
  title: string
  icon: string
}

export default React.memo(function DisplayNode({ data, selected, ...props }: NodeProps<Props>) {
  return (
    <WrapperNode
      nodeTitle={data.title}
      iconClass={data.icon}
      position={Position.Left}
      selected={selected}
      nodeId={props.id}
    >
      <Preview nodeId={props.id} className='nodrag cursor-pointer'/>
    </WrapperNode>
  )
})

