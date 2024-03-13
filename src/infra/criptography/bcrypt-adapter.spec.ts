import bcrypt from 'bcrypt'
import { type Encrypter } from '@/data/protocols/encrypter'
import { BcryptAdapter } from './bcrypt-adapter'

const SALT = 12
const createSut = (): Encrypter => {
  const sut = new BcryptAdapter(SALT)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = createSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(bcryptSpy).toHaveBeenCalledWith('any_value', SALT)
  })
})
