import { signal } from "@preact/signals"

interface CustomNode {
  id: string
  title: string
  icon: string
  content?: File
  description?: string
  type?: string,
  contentNodeConnected?: boolean
  styleNodeConnected?: boolean
}

const nodesState = signal<CustomNode[]>([])

export default nodesState
export type { CustomNode }