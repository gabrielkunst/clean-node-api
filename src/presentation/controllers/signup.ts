import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import { type Controller, type HttpResponse, type HttpRequest, type EmailValidator } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email as string)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
