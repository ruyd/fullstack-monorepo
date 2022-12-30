import React from 'react'
import { useNavigate } from 'react-router-dom'
import config from 'src/shared/config'
import loadConfig from 'src/shared/loadConfig'
import { useAppSelector } from 'src/shared/store'

export function ConfigProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const loaded = React.useRef<boolean>(false)
  const navigate = useNavigate()
  const ready = useAppSelector(state => state.app.ready)
  React.useEffect(() => {
    const run = async () => {
      if (!ready && window.location.pathname !== '/start') {
        navigate('/start')
        return
      }
      if (ready || loaded.current) return
      loaded.current = true
      const result = await loadConfig()
      // eslint-disable-next-line no-console
      console.log('loading config', result, config.auth)
    }
    run()
  }, [ready, navigate])
  return children as JSX.Element
}

export default ConfigProvider
