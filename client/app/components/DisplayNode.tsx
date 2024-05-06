import type { NodeProps } from 'reactflow'
import WrapperNode from './WrapperNode'
import { Position } from 'reactflow'
import Attachment from './Attachment'
import React from 'react'

interface Props {
  title: string
  icon: string
}

export default React.memo(function DisplayNode({ data, selected, ...props }: NodeProps<Props>) {
  //TODO: start working on functionality next
  return (
    <WrapperNode
      nodeTitle={data.title}
      iconClass={data.icon}
      position={Position.Left}
      selected={selected}
      nodeId={props.id}
    >
      <Attachment nodeId={props.id} label='display node' attachmentType='preview' />
    </WrapperNode>
  )
})

