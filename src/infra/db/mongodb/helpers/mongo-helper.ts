import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  map<T>(document: any): T {
    const { _id, ...documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  }
}
