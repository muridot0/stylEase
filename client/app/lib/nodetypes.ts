import { InputNode, DisplayNode, ModelNode} from '~/components'
import { CONTENT_NODE_TYPE, DISPLAY_NODE_TYPE, MODEL_NODE_TYPE, STYLE_NODE_TYPE } from '~/state/nodesState'

const nodeTypes = {
  [STYLE_NODE_TYPE]: InputNode,
  [CONTENT_NODE_TYPE]: InputNode,
  [MODEL_NODE_TYPE]: ModelNode,
  [DISPLAY_NODE_TYPE]: DisplayNode
}

export default nodeTypes
