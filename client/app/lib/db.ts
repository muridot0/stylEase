import Dexie, { Table } from "dexie"
import { ReactFlowJsonObject } from "reactflow";
import { CustomNode } from "~/state/nodesState";

export interface Schema {
  data: {url: ImageData, name: string, size: number, width: number, height: number}
}

export class SubClassDexie extends Dexie {
  imagedata!: Table<Schema>
  flow!: Table<ReactFlowJsonObject<CustomNode> | undefined>

  constructor() {
    super('stylEase');
    this.version(1).stores({
      flow: '',
      imagedata: 'id, data'
    })
  }

}

export const db = new SubClassDexie();
