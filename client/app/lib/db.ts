import Dexie, { Table } from "dexie"
import { ReactFlowJsonObject } from "reactflow";
import { CustomNode } from "~/state/nodesState";

export class SubClassDexie extends Dexie {
  flow!: Table<ReactFlowJsonObject<CustomNode> | undefined>

  constructor() {
    super('stylEase');
    this.version(1).stores({
      flow: '',
    })
  }

}

export const db = new SubClassDexie();
