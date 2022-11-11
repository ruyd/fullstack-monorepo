import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('renders learn react link', async () => {
  render(<App />)
  const appLinks = screen.getAllByText(/Drawspace/i)
  expect(appLinks).toBeGreaterThan(0)
})
