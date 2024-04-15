import React from "react"
import { NodeProps } from "reactflow"

interface Props {
  title: string,
  icon: string
}

export default React.memo(function ModelNode({data, selected}: NodeProps<Props>) {
  //TODO: implement model node
  return (
    <div></div>
  )
})