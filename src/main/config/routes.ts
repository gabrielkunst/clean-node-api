import { Router, type Express } from 'express'
import { signupRoutes } from '../routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api/v1', router)

  signupRoutes(router)
}
