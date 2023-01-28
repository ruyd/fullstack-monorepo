import request from 'supertest'
import createBackendApp from '../../app'
import { getRoutesFromApp } from '../../shared/server'

describe('server route checks', () => {
  const app = createBackendApp({ checks: false, trace: true })
  const routes = getRoutesFromApp(app)

  test('should have at least one route', () => {
    expect(routes.length).toBeGreaterThan(0)
  })
  test('should return a 200 status code', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
  test('should return a 404 status code', async () => {
    const response = await request(app).get('/not-found')
    expect(response.status).toBe(404)
  })
})
