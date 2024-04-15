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
  //TODO: add functionality to output node
  return (
    <WrapperNode
      nodeTitle={data.title}
      iconClass={data.icon}
      position={Position.Left}
      selected={selected}
      nodeId={props.id}
    >
      <Attachment label='display node' attachmentType='preview' />
    </WrapperNode>
  )
})

const DISPLAY_NODE_TYPE = 'display-node-type'

export { DISPLAY_NODE_TYPE }
