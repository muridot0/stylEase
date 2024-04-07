import NodeHandle from './NodeHandle'
import { Position } from 'reactflow'

function WrapperNode() {
  return (
    <div>
      <NodeHandle position={Position.Left} type="target"></NodeHandle>
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" className="nodrag" />
      </div>
    </div>
  )
}

export default WrapperNode
