import randomStr from "~/lib/randomStr"
import type { CustomNode } from "~/state/nodesState"
import { STYLE_NODE_TYPE, DISPLAY_NODE_TYPE } from "~/components"

export const nodeData: CustomNode[] = [
  {
    id: `style-node-${randomStr(10)}`,
    title: 'Style Node',
    type: STYLE_NODE_TYPE,
    icon: 'i-lucide-image-plus',
    description: 'Upload an image to get it stylEased'
  },
  {
    id: `model-node-${randomStr(10)}`,
    title: 'Style Transfer Model',
    type: 'model-node-type',
    icon: 'i-lucide-brain-cog',
    description: 'Style transfer model: this model stylEases your images'
  },
  {
    id: `display-node-${randomStr(10)}`,
    title: 'Display Node',
    type: DISPLAY_NODE_TYPE,
    icon: 'i-lucide-aperture',
    description: 'View your stylEased image'
  }
]
