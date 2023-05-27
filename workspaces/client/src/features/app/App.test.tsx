import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { config } from '../../shared/config'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('App', () => {
  test('Root render', async () => {
    const axiosMock = new MockAdapter(axios)
    axiosMock.onGet('/config').reply(200, { ready: true })
    axiosMock.onGet('/gallery').reply(200, { mocked: true })
    const { findAllByRole } = render(<App />)
    await waitFor(() => findAllByRole('progressbar'), {
      timeout: 5000
    })
    const appLinks = screen.getAllByText(config.defaultTitle)
    expect(appLinks.length).toBeGreaterThan(0)
  }, 10000)
})
