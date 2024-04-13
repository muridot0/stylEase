import React from "react"
import { Panel } from "reactflow"
import { nodeData } from "~/data/nodeData"
import DrawerItem from "./DrawerItem"

export default function NodeDrawer() {
  console.log(nodeData)
  return (
    <Panel position="top-left" className="relative top-[25rem] rounded-[8px] bg-[--node-bg-color] border border-[--node-border-color] p-4" style={{ top: 150 }}>
      {Object.entries(nodeData).map(([key, value]) => {
        return (
          <div>
            {key === 'StyleNode' && <div>heyyy{key}</div>}
            {key === 'DisplayNode' && <div>heyyy{key}</div>}
            {key === 'ModelNode' && <div>heyyy{key}</div>}
          </div>
        )
      })}
      <DrawerItem nodeData={nodeData}></DrawerItem>
    </Panel>
  )
}