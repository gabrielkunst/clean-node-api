import { type EmailValidator } from '@/presentation/protocols/email-validator'
import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const createSut = (): EmailValidator => {
  const sut = new EmailValidatorAdapter()
  return sut
}

describe('EmailValidatorAdapter', () => {
  test('Should return true if validator returns true', () => {
    const sut = createSut()
    const isValid = sut.isValid('valid_email@mail.com')

    expect(isValid).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    const sut = createSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })
})
