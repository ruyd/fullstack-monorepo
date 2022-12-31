import React from 'react'
import { useNavigate } from 'react-router-dom'
import loadConfig from 'src/shared/loadConfig'
import { useAppSelector } from 'src/shared/store'

export function ConfigProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const loaded = React.useRef<boolean>(false)
  const navigate = useNavigate()
  const ready = useAppSelector(state => state.app.ready)
  // const token = useAppSelector(state => state.app.token)
  React.useEffect(() => {
    const run = async () => {
      if (loaded.current && !ready && window.location.pathname !== '/start') {
        navigate('/start')
        return
      }
      if (ready || loaded.current) return
      loaded.current = true
      await loadConfig()
    }
    run()
  }, [ready, navigate])
  return children as JSX.Element
}

export default ConfigProvider
