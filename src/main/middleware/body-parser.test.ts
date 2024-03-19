import app from '../config/app'
import request from 'supertest'

describe('Body Parser', () => {
  test('Should return parsed body', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({
        name: 'any name'
      })
      .expect({
        name: 'any name'
      })
  })
})
