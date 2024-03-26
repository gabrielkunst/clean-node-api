import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { type Router } from 'express'
import env from '../config/env'

export const signupRoutes = (router: Router): void => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  router.post('/signup', (req, res) => {
    res.send()
  })
}
