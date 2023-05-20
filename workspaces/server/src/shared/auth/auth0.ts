import axios from 'axios'
import config from '../config'

export function auth0Register(payload: Record<string, string>) {
  return axios.post(`${config.auth?.baseUrl}/dbconnections/signup`, {
    connection: 'Username-Password-Authentication',
    client_id: config.auth?.clientId,
    email: payload.email,
    password: payload.password,
    user_metadata: {
      id: payload.userId
    }
  })
}

export async function auth0Login(username: string, password: string) {
  const response = await axios.post(
    `${config.auth?.baseUrl}/oauth/token`,
    {
      client_id: config.auth?.clientId,
      client_secret: config.auth?.clientSecret,
      audience: `${config.auth?.baseUrl}/api/v2/`,
      grant_type: 'password',
      username,
      password
    },
    {
      validateStatus: () => true
    }
  )
  return response
}
