import { signal } from "@preact/signals"
import { Node } from "reactflow"

interface CustomNode {
  id: string
  title: string
  icon: string
  content?: {name: string, url: string, size: number}
  description?: string
  type?: string,
  contentNodeConnected?: boolean
  styleNodeConnected?: boolean
  displayNodeConnected?: boolean
}

const globalNodeState = signal<Node<CustomNode>[]>([])

export default globalNodeState
export type { CustomNode }