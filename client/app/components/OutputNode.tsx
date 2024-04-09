import type { NodeProps } from "reactflow";
import WrapperNode from "./WrapperNode";
import { Position } from "reactflow";
import Attachment from "./Attachment";

interface Props {
  title: string
  icon: string
}

export default function OutputNode({data}: NodeProps<Props>) {
  //TODO: create the output node component with functionality
  return(
    <WrapperNode nodeTitle={data.title} iconClass={data.icon} position={Position.Left}>
      <Attachment label="display node" attachmentType="preview"/>
    </WrapperNode>
  )
}