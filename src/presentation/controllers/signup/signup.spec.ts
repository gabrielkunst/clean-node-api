import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors'
import { type EmailValidator, type HttpRequest, type AccountModel, type AddAccountModel, type AddAccount } from './signup-protocols'
import { SignUpController } from './signup'

const createAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const createSut = (): SutTypes => {
  const addAccountStub = createAddAccount()
  const emailValidatorStub = createEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut, emailValidatorStub, addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return error if no name is provided', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@email.com',
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
        email: 'any_email@email.com',
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
        email: 'any_email@email.com',
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
  test('Should return error if password confirmation fails', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('Should return error if email is not valid', () => {
    const { sut, emailValidatorStub } = createSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
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
    const { sut, emailValidatorStub } = createSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@email.com')
  })
  test('Should return 500 if EmailValidator throws an error', () => {
    const { sut, emailValidatorStub } = createSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
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
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = createSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if AddAccount throws an error', () => {
    const { sut, addAccountStub } = createSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
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
  test('Should return 201 if a new account is created', () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      throw new Error('Response is not defined')
    }

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})