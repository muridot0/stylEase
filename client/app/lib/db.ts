import Dexie, { Table } from "dexie"

export interface Schema {
  id: string;
  data: {url: ImageData, name: string, size: number}
}

export class SubClassDexie extends Dexie {
  imagedata!: Table<Schema>
  testData!: Table<any>

  constructor() {
    super('stylEase');
    this.version(1).stores({
      imagedata: 'id, data',
      testData: 'id'
    })
  }

}

export const db = new SubClassDexie();
