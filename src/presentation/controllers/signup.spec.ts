import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { type EmailValidator, type HttpRequest } from '../protocols'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator

}

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const createEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }

  return new EmailValidatorStub()
}

const createSut = (): SutTypes => {
  const emailValidatorStub = createEmailValidator()
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
  test('Should return error if no password confirmation is provided', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
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
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidator } = createSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })
  test('Should return 500 if EmailValidator throws an error', () => {
    const emailValidator = createEmailValidatorWithError()
    const sut = new SignUpController(emailValidator)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
})
