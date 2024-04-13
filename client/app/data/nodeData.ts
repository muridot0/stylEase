import randomStr from "~/lib/randomStr"
import type { CustomNode } from "~/state/nodesState"

export const nodeData: CustomNode[] = [
  {
    id: `style-node-${randomStr(10)}`,
    title: 'Style Node',
    icon: 'i-lucide-image-plus',
    description: 'Upload an image to get it stylEased'
  },
  {
    id: `display-node-${randomStr(10)}`,
    title: 'Display Node',
    icon: 'i-lucide-download',
    description: 'View your stylEased image'
  },
  {
    id: `model-node-${randomStr(10)}`,
    title: 'Style Transfer Model',
    icon: 'i-lucide-brain-cog',
    description: 'Style transfer model: this model stylEases your images'
  }
]
