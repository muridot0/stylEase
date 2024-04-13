import randomStr from "~/lib/randomStr"
import type { CustomNode } from "~/state/nodesState"

export const nodeData: Record<string, CustomNode> = {
  StyleNode: {
    id: `style-node-${randomStr(10)}`,
    title: 'Style Node',
    icon: 'i-lucide-image-plus',
    description: 'Upload an image to get it stylEased'
  },
  DisplayNode: {
    id: `display-node-${randomStr(10)}`,
    title: 'Display Node',
    icon: 'i-lucide-download',
    description: 'View your stylEased image'
  },
  ModelNode: {
    id: `model-node-${randomStr(10)}`,
    title: 'Style Transfer Model',
    icon: 'i-lucide-brain-cog',
    description: 'StylEase your image'
  }
}
