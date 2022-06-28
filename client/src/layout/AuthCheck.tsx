import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../shared/store'

export default function AuthCheck({
  children,
  secure,
}: {
  children: React.ReactNode
  secure?: boolean
}) {
  const token = useAppSelector((state) => state.app.token)
  const navigate = useNavigate()
  React.useEffect(() => {
    if (secure && !token) {
      navigate('/login', { replace: true })
    }
  }, [navigate, secure, token])
  return children as JSX.Element
}