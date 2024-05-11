import Dexie, { Table } from "dexie"

export interface Schema {
  id: string;
  data: {url: ImageData, name: string, size: number}
}

export class SubClassDexie extends Dexie {
  imagedata!: Table<Schema>

  constructor() {
    super('stylEase');
    this.version(1).stores({
      imagedata: 'id, data'
    })
  }

}

export const db = new SubClassDexie();
