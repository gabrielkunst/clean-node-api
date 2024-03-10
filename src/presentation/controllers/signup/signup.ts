import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, created, serverError } from '@/presentation/helpers'
import { type Controller, type HttpResponse, type HttpRequest, type EmailValidator, type AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email as string)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({
        name, email, password
      })

      return created(account)
    } catch (error) {
      return serverError()
    }
  }
}
