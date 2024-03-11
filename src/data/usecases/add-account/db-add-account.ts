import { type Encrypter } from '@/data/protocols/encrypter'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountModel, type AddAccount } from '@/domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    const createdAccount: AccountModel = {
      email: 'valid_email@email.com',
      name: 'valid_name',
      id: 'valid_id',
      password: hashedPassword
    }

    return createdAccount
  }
}
