import { render, fireEvent, act } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import LoginForm from './Login'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { RootState, reducers } from 'src/shared/store'
import { signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth'
import { STORAGE_KEY } from 'src/shared/auth'

jest.mock('@firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({ mocked: true }),
  registerVersion: jest.fn(),
  getApps: jest.fn().mockReturnValue([]),
  _registerComponent: jest.fn()
}))

jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({ mocked: true }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      getIdToken: jest.fn().mockResolvedValue('id token mock')
    }
  }),
  signInWithCustomToken: jest.fn().mockResolvedValue('custom token mock')
}))

const mocks = {
  uid: '123',
  email: 'test@example.com',
  password: 'password123',
  idToken: 'id token mock',
  customToken: 'custom token mock'
}
const mockResponse = {
  token: mocks.customToken,
  user: { email: mocks.email, userId: mocks.uid, firstName: 'Mock' }
}

export const renderWithContext = async (
  element: React.ReactElement,
  state?: Partial<RootState>
) => {
  const preloadedState = {
    app: {
      locale: 'en',
      dialog: 'onboard',
      settings: {
        system: {
          authProvider: 'firebase'
        }
      }
    },
    ...state
  } as RootState

  const testStore = configureStore({
    reducer: reducers,
    preloadedState
  })

  const queryClient = new QueryClient({})
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <Provider store={testStore}>
          <BrowserRouter>{element}</BrowserRouter>
        </Provider>
      </QueryClientProvider>
    ),
    testStore
  }
}

describe('Firebase Login', () => {
  test('Firebase SDK', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/profile/login').reply(200, mockResponse)

    const { getByPlaceholderText, getByText } = await renderWithContext(<LoginForm />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: mocks.email } })
    fireEvent.change(passwordInput, { target: { value: mocks.password } })

    const submitButton = getByText('Sign In', { selector: 'button' })
    fireEvent.click(submitButton)

    await act(async () => {
      await Promise.resolve()
    })

    expect(signInWithCustomToken).toHaveBeenCalledWith({ mocked: true }, mocks.customToken)
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      { mocked: true },
      mocks.email,
      mocks.password
    )
  })

  test('Should call login endpoint with inputs', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/profile/login').reply(200, mockResponse)
    const { getByPlaceholderText, getByText } = await renderWithContext(<LoginForm />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: mocks.email } })
    fireEvent.change(passwordInput, { target: { value: mocks.password } })

    const submitButton = getByText('Sign In', { selector: 'button' })
    fireEvent.click(submitButton)

    await act(async () => {
      await Promise.resolve()
    })

    expect(mock.history.post[0].url).toBe('profile/login')
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        email: mocks.email,
        password: mocks.password,
        idToken: mocks.idToken
      })
    )
  })

  test('Should update store with user and token', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/profile/login').reply(200, mockResponse)
    const { getByPlaceholderText, getByText, testStore } = await renderWithContext(<LoginForm />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: mocks.email } })
    fireEvent.change(passwordInput, { target: { value: mocks.password } })

    const submitButton = getByText('Sign In', { selector: 'button' })
    fireEvent.click(submitButton)

    await act(async () => {
      await Promise.resolve()
    })

    const state = testStore.getState()
    expect(state.app.user?.email).toEqual(mocks.email)
    expect(state.app.user?.userId).toEqual(mocks.uid)
    expect(state.app.token).toEqual(mocks.customToken)
    expect(state.app.dialog).toBeFalsy()
  })

  test('Should set token to local storage', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/profile/login').reply(200, mockResponse)
    const { getByPlaceholderText, getByText } = await renderWithContext(<LoginForm />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: mocks.email } })
    fireEvent.change(passwordInput, { target: { value: mocks.password } })

    const submitButton = getByText('Sign In', { selector: 'button' })
    fireEvent.click(submitButton)

    await act(async () => {
      await Promise.resolve()
    })

    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(local.token).toEqual(mocks.customToken)
  })

  test('Should set axios default headers', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/profile/login').reply(200, mockResponse)
    const { getByPlaceholderText, getByText } = await renderWithContext(<LoginForm />)

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: mocks.email } })
    fireEvent.change(passwordInput, { target: { value: mocks.password } })

    const submitButton = getByText('Sign In', { selector: 'button' })
    fireEvent.click(submitButton)

    await act(async () => {
      await Promise.resolve()
    })

    expect(axios.defaults.headers.common['Authorization']).toEqual(`Bearer ${mocks.customToken}`)
  })
})
