import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('Should return 200', async () => {
    await request(app).post('/api/v1/signup').send().expect(200)
  })
})
