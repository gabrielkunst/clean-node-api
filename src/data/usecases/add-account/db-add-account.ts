import { type AddAccountRepository } from '@/data/protocols/add-account-reposltory'
import { type Encrypter } from '@/data/protocols/encrypter'
import { type AccountModel } from '@/domain/models/account'
import {
  type AddAccountModel,
  type AddAccount
} from '@/domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return account
  }
}
