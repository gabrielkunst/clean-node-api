import { type EmailValidator } from '@/presentation/protocols/email-validator'
import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const createSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Should return true if validator returns true', () => {
    const sut = createSut()
    const isValid = sut.isValid('valid_email@email.com')

    expect(isValid).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    const sut = createSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })
  test('Should call EmailValidatorAdapter.isValid with correct email', () => {
    const sut = createSut()
    const isValidSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('valid_email@email.com')
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@email.com')
  })
})
