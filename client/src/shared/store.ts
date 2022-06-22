import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import appReducer from '../features/app/slice'
import counterReducer from '../features/canvas/slice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    counter: counterReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
