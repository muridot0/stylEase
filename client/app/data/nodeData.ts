import randomStr from '~/lib/randomStr'
import { CONTENT_NODE_TYPE, DISPLAY_NODE_TYPE, MODEL_NODE_TYPE, STYLE_NODE_TYPE, type CustomNode } from '~/state/nodesState'

export const nodeData: CustomNode[] = [
  {
    id: `style-node-${randomStr(10)}`,
    title: 'Style Node',
    type: STYLE_NODE_TYPE,
    icon: 'i-lucide-paintbrush',
    description: 'Upload the image you want to use as reference for stylEasing',
    uploadMsg: 'Upload a reference image'
  },
  {
    id: `content-node-${randomStr(10)}`,
    title: 'Content Node',
    type: CONTENT_NODE_TYPE,
    icon: 'i-lucide-image-plus',
    description: 'Upload an image to get it stylEased',
    uploadMsg: 'Upload image to stylEase'
  },
  {
    id: `model-node-${randomStr(10)}`,
    title: 'Style Transfer Model',
    type: MODEL_NODE_TYPE,
    icon: 'i-lucide-brain-cog',
    description: 'Style transfer model: this model stylEases your images',
    styleNodeConnected: false,
  },
  {
    id: `display-node-${randomStr(10)}`,
    title: 'Display Node',
    type: DISPLAY_NODE_TYPE,
    icon: 'i-lucide-aperture',
    description: 'View your stylEased image'
  }
]
