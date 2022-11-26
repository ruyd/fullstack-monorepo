import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { config } from '../../shared/config'

describe('App', () => {
  test('Root render', async () => {
    const { findAllByRole } = render(<App />)
    await waitFor(() => findAllByRole('progressbar'))
    const appLinks = screen.getAllByText(config.defaultTitle)
    expect(appLinks.length).toBeGreaterThan(0)
  })
})
