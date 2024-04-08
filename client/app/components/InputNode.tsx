import Attachment from "./Attachment"
import WrapperNode from "./WrapperNode"

export default function InputNode() {
  return (
    <WrapperNode>
      <Attachment maxFileSize={500000} label="hmm" className="nodrag"/>
    </WrapperNode>
  )
}