import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { type EmailValidator } from '../protocols/email-validator'
import { type HttpRequest } from '../protocols/http'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator

}

const createSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut, emailValidator: emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return error if no name is provided', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  test('Should return error if no email is provided', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
  test('Should return error if no password is provided', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })
  test('Should return error if email is not valid', () => {
    const { sut, emailValidator } = createSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
})
