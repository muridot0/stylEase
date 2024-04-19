import { signal } from "@preact/signals"
import { Node } from "reactflow"

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

const globalNodeState = signal<Node<CustomNode>[]>([])

export default globalNodeState
export type { CustomNode }