import { signal } from "@preact/signals"

interface CustomNode {
  id: string
  title: string
  icon: string
  content?: File
}

const nodesState = signal<CustomNode[]>([])

export default nodesState
export type { CustomNode }