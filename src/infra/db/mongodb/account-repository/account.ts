import { type AddAccountRepository } from '@/data/protocols/add-account-repository'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountModel } from '@/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne<AccountModel & { _id: string }>({ _id: result.insertedId })
    const { _id, ...rest } = account!
    return Object.assign({}, rest, { id: _id })
  }
}
