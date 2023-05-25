import { render, fireEvent, act } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import LoginForm from './Login'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth'
import { STORAGE_KEY } from 'src/shared/auth'
import { onTapClickAsync } from './GoogleOneTap'
import { type RootState, getStore, useAppDispatch, useAppSelector } from 'src/shared/store'
const { reducers } = jest.requireActual('src/shared/store')

jest.mock('src/shared/store', () => ({
  getStore: jest.fn(),
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn()
}))

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
  signInWithCustomToken: jest.fn().mockResolvedValue('custom token mock'),
  signInWithCredential: jest.fn().mockResolvedValue('custom token mock')
}))

const mocks = {
  uid: '123',
  email: 'test@example.com',
  password: 'password123',
  idToken: 'id token mock',
  customToken: 'custom token mock'
}
const mockOkResponse = {
  token: mocks.customToken,
  user: { email: mocks.email, userId: mocks.uid, firstName: 'Mock' }
}

export const mockErrorResponse = {
  error: {
    message: 'error message'
  }
}

const mockIdTokenWithEmail =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.-6o-_8nZ_VCetTXmRS5cqkrhJVausvEyzWFbiM58lys'

export const mockStore = (state?: Partial<RootState>) => {
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
  }) as ToolkitStore<RootState>

  jest.mocked(getStore).mockReturnValue(testStore)
  jest.mocked(useAppDispatch).mockImplementation(() => testStore.dispatch)
  jest.mocked(useAppSelector).mockImplementation(selector => selector(testStore.getState()))

  return testStore
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
  const testStore = mockStore(preloadedState)
  const testQueryClient = new QueryClient({})
  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>
        <Provider store={testStore}>
          <BrowserRouter>{element}</BrowserRouter>
        </Provider>
      </QueryClientProvider>
    ),
    testStore,
    testQueryClient
  }
}

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Login Flows', () => {
  const mockLoginFlow = async (state?: Partial<RootState>) => {
    const axiosMock = new MockAdapter(axios)
    axiosMock.onPost('/profile/login').reply(200, mockOkResponse)

    const returns = await renderWithContext(<LoginForm />, state)
    const { getByPlaceholderText, getByText } = returns

    const emailInput = getByPlaceholderText('Email')
    const passwordInput = getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: mocks.email } })
    fireEvent.change(passwordInput, { target: { value: mocks.password } })

    const submitButton = getByText('Sign In', { selector: 'button' })
    fireEvent.click(submitButton)

    await act(async () => {
      await Promise.resolve()
    })

    return {
      ...returns,
      axiosMock
    }
  }

  test('Firebase User and Pass', async () => {
    const state = {
      app: {
        settings: {
          system: {
            authProvider: 'firebase'
          }
        }
      }
    } as RootState
    await mockLoginFlow(state)
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      { mocked: true },
      mocks.email,
      mocks.password
    )
    expect(signInWithCustomToken).toHaveBeenCalledWith({ mocked: true }, mocks.customToken)
  })

  test('Should call login endpoint with inputs', async () => {
    const { axiosMock } = await mockLoginFlow()
    expect(axiosMock.history.post[0].url).toBe('profile/login')
    expect(axiosMock.history.post[0].data).toBe(
      JSON.stringify({
        email: mocks.email,
        password: mocks.password,
        idToken: mocks.idToken
      })
    )
  })

  test('Should update store with user and token', async () => {
    const { testStore } = await mockLoginFlow()
    const state = testStore.getState()
    expect(state.app.user?.email).toEqual(mocks.email)
    expect(state.app.user?.userId).toEqual(mocks.uid)
    expect(state.app.token).toEqual(mocks.customToken)
    expect(state.app.dialog).toBeFalsy()
  })

  test('Should set token to local storage', async () => {
    await mockLoginFlow()
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(local.token).toEqual(mocks.customToken)
  })

  test('Should set axios default headers', async () => {
    await mockLoginFlow()
    expect(axios.defaults.headers.common['Authorization']).toEqual(`Bearer ${mocks.customToken}`)
  })

  test('Check GoogleOneTap firebase login flow', async () => {
    const axiosMock = new MockAdapter(axios)
    axiosMock.onPost('/profile/login').reply(200, mockOkResponse)
    const preState = {
      app: {
        settings: {
          system: {
            authProvider: 'firebase',
            enableOneTapLogin: true
          },
          google: {
            clientId: '123'
          }
        }
      }
    } as RootState
    const testStore = mockStore(preState)
    await onTapClickAsync(mockIdTokenWithEmail)
    const postState = testStore.getState()
    expect(postState.app.user?.email).toEqual(mocks.email)

    expect(axiosMock.history.post[0].url).toBe('profile/login')
    expect(axiosMock.history.post[0].data).toBe(
      JSON.stringify({
        idToken: mockIdTokenWithEmail
      })
    )

    expect(signInWithCustomToken).toHaveBeenCalledWith({ mocked: true }, mocks.customToken)
  })

  // test('Should show error message', async () => {
  // test('auth0 login', async () => {
})
