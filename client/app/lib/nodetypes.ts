import { InputNode, DisplayNode, STYLE_NODE_TYPE, DISPLAY_NODE_TYPE, MODEL_NODE_TYPE, ModelNode, CONTENT_NODE_TYPE } from '~/components'

const nodeTypes = {
  [STYLE_NODE_TYPE]: InputNode,
  [CONTENT_NODE_TYPE]: InputNode,
  [MODEL_NODE_TYPE]: ModelNode,
  [DISPLAY_NODE_TYPE]: DisplayNode
}

export default nodeTypes
