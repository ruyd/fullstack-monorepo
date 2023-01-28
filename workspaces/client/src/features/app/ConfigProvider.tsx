import React from 'react'
import loadConfig from '../../shared/loadConfig'
import { useAppSelector } from '../../shared/store'
import MaintenancePage from '../../features/pages/Maintenance'
import StartPage from '../../features/pages/Start'
import { useLocation } from 'react-router-dom'
import { hasRole } from '../../shared/auth'

export function ConfigProvider({ children }: { children: React.ReactElement }): JSX.Element {
  const location = useLocation()
  const isLoading = React.useRef<boolean>(false)
  const loaded = useAppSelector(state => state.app.loaded)
  const ready = useAppSelector(state => state.app.ready)
  const token = useAppSelector(state => state.app.token)
  const maintenance = useAppSelector(state => state.app.settings?.system?.disable)
  const showStart = loaded && !ready
  const showMaintenance =
    maintenance && (!token || !hasRole('admin')) && location.pathname !== '/login'

  React.useEffect(() => {
    const run = async () => {
      if ((loaded && ready) || isLoading.current) return
      isLoading.current = true
      await loadConfig()
      isLoading.current = false
    }
    run()
  }, [loaded, ready])

  if (showStart) {
    return <StartPage />
  }

  if (showMaintenance) {
    return <MaintenancePage />
  }

  return children
}

export default ConfigProvider
