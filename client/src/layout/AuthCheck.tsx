import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  React.useEffect(() => {
    if (secure && !token) {
      navigate('/login?returnTo=' + location.pathname, { replace: true })
    }
  }, [location, navigate, secure, token])
  return children as JSX.Element
}
