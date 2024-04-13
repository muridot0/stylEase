import { StyleNode, DisplayNode, STYLE_NODE_TYPE, DISPLAY_NODE_TYPE } from '~/components'

const nodeTypes = {
  [STYLE_NODE_TYPE]: StyleNode,
  [DISPLAY_NODE_TYPE]: DisplayNode
}

export default nodeTypes
