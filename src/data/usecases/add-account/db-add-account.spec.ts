import { type Encrypter } from '@/data/protocols/encrypter'
import { DbAddAccount } from './db-add-account'
import { type AddAccountModel } from '@/domain/usecases/add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const createEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncrypterStub()
}

const createSut = (): SutTypes => {
  const encrypterStub = createEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return { sut, encrypterStub }
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
})
