import { Panel } from "reactflow"
import { nodeData } from "~/data/nodeData"
import DrawerItem from "./DrawerItem"

export default function NodeDrawer() {
  //TODO: complete node drawer component and add the option to close it down
  return (
    <Panel position="top-left" className="relative top-[25rem] rounded-[8px] bg-[--node-bg-color] border border-[--node-border-color] p-4" style={{ top: 150 }}>
      <DrawerItem nodeData={nodeData[0]}></DrawerItem>
    </Panel>
  )
}