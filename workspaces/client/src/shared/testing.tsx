import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

import { type RootState, getStore, useAppDispatch, useAppSelector } from 'src/shared/store'
const { reducers } = jest.requireActual('src/shared/store')
jest.mock('src/shared/store', () => ({
  getStore: jest.fn(),
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn()
}))

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
