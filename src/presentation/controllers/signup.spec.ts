import { MissingParamError } from '../errors/missing-param-error'
import { type HttpRequest } from '../protocols/http'
import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return error if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      return
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  test('Should return error if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    if (!response) {
      return
    }

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
})
