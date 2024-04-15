import { StyleNode, DisplayNode, STYLE_NODE_TYPE, DISPLAY_NODE_TYPE, MODEL_NODE_TYPE, ModelNode } from '~/components'

const nodeTypes = {
  [STYLE_NODE_TYPE]: StyleNode,
  [MODEL_NODE_TYPE]: ModelNode,
  [DISPLAY_NODE_TYPE]: DisplayNode
}

export default nodeTypes
