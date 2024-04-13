import { CustomNode } from '~/state/nodesState'

export default function DrawerItem({nodeData}: Record<string, CustomNode>) {
  {
    for (const [key, value] of Object.entries(nodeData)) {
      return (
        <div>
          {key} {value.icon}
        </div>
      )
    }
  }
}
