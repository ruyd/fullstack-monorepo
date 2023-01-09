import React from 'react'
import { useAppSelector } from '../../shared/store'
import Login from './Login'

export default function AuthCheck({
  children,
  secure,
}: {
  children: React.ReactNode
  secure?: boolean
}) {
  const token = useAppSelector(state => state.app.token)
  const denied = secure && !token
  if (denied) {
    return <Login />
  }
  return children as JSX.Element
}
