import { signal } from "@preact/signals"

interface CustomNode {
  id: string
  title: string
  icon: string
  content?: File
  description?: string
}

// TODO: add type value to customNode

const nodesState = signal<CustomNode[]>([])

export default nodesState
export type { CustomNode }