import React from 'react'
import { useNavigate } from 'react-router-dom'
import config from 'src/shared/config'
import { Paths } from 'src/shared/routes'
import { useAppSelector } from '../../shared/store'

export default function AuthCheck({
  children,
  secure,
}: {
  children: React.ReactNode
  secure?: boolean
}) {
  const token = useAppSelector(state => state.app.token)
  const navigate = useNavigate()
  const denied = secure && !token
  React.useEffect(() => {
    if (denied) {
      const fullPath = window.location.href
        .replace(window.location.origin, '')
        .replace(config.baseName, '')
      navigate(`${Paths.Login}?returnTo=${fullPath}`)
    }
  }, [denied, navigate])
  if (denied) {
    return null
  }
  return children as JSX.Element
}
