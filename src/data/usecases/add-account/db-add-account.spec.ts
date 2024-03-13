import { type Encrypter } from '@/data/protocols/encrypter'
import { DbAddAccount } from './db-add-account'
import { type AddAccountModel } from '@/domain/usecases/add-account'
import { type AddAccountRepository } from '@/data/protocols/add-account-reposltory'
import { type AccountModel } from '@/domain/models/account'

const createAddAccountRepository = (): AddAccountRepository => {
  class AddAcountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }

  return new AddAcountRepositoryStub()
}

const createEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncrypterStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const createSut = (): SutTypes => {
  const addAccountRepositoryStub = createAddAccountRepository()
  const encrypterStub = createEncrypter()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAddAccount', () => {
  test('Should call encrypter.encrypt with correct password', async () => {
    const { sut, encrypterStub } = createSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const account: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    await sut.add(account)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if DbAddAccount throws', async () => {
    const { sut, encrypterStub } = createSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const account: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = createSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const account: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    await sut.add(account)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
  })
})
