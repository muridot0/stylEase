import { signal } from '@preact/signals'
import { Node } from 'reactflow'
import randomStr from '~/lib/randomStr'

const STYLE_NODE_TYPE = 'style-node-type'
const CONTENT_NODE_TYPE = 'content-node-type'
const DISPLAY_NODE_TYPE = 'display-node-type'
const MODEL_NODE_TYPE = 'model-node-type'

interface CustomNode {
  id: string
  title: string
  icon: string
  content?: {
    name: string
    url: string | ImageData
    size: number
    width: number
    height: number
  } | undefined
  description?: string
  type?: string
  contentNodeConnected?: boolean
  styleNodeConnected?: boolean
  displayNodeConnected?: boolean
  uploadMsg?: string
  styleNodeId?: string | null
  styleImage?: {
    name: string
    size: number
    url: string | ImageData
    width: number
    height: number
  }
  contentNodeId?: string | null
  contentImage?: {
    name: string
    size: number
    url: string | ImageData
    width: number
    height: number
  },
  stylEasing?: boolean
  displayNodeId?: string | null
}

const globalNodeState = signal<Node<CustomNode>[]>([])

const initialNodes = [
  {
    id: '1',
    type: STYLE_NODE_TYPE,
    position: { x: 490, y: 223 },
    data: {
      title: 'Style Node',
      icon: 'i-lucide-paintbrush',
      id: `style-node-1`,
      uploadMsg: 'Upload a reference image'
    }
  },
  {
    id: '2',
    type: CONTENT_NODE_TYPE,
    position: { x: 490, y: 532 },
    data: {
      title: 'Content Node',
      icon: 'i-lucide-image-plus',
      id: `content-node-2`,
      uploadMsg: 'Upload image to stylEase'
    }
  },
  {
    id: '3',
    type: MODEL_NODE_TYPE,
    position: { x: 813, y: 379 },
    data: {
      title: 'Style Transfer Node',
      icon: 'i-lucide-brain-cog',
      id: `model-node-3`,
      styleNodeConnected: true,
      contentNodeConnected: true,
      displayNodeConnected: true,
      styleNodeId: '1',
      contentNodeId: '2',
      displayNodeId: '4'
    }
  },
  {
    id: '4',
    type: DISPLAY_NODE_TYPE,
    position: { x: 1133, y: 352 },
    data: {
      title: 'Display Node',
      icon: 'i-lucide-aperture',
      id: `display-node-4`,
      stylEasing: false
    }
  }
]

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    sourceHandle: '1',
    target: '3',
    targetHandle: 'style-input'
  },
  {
    id: 'e2-3',
    source: '2',
    sourceHandle: '2',
    target: '3',
    targetHandle: 'content-input'
  },
  {
    id: 'e3-4',
    source: '3',
    sourceHandle: '3',
    target: '4',
    targetHandle: 'model-input'
  }
]

export default globalNodeState
export type { CustomNode }
export {
  initialEdges,
  initialNodes,
  STYLE_NODE_TYPE,
  CONTENT_NODE_TYPE,
  DISPLAY_NODE_TYPE,
  MODEL_NODE_TYPE
}
