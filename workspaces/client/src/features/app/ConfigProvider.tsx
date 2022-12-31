import React from 'react'
import loadConfig from 'src/shared/loadConfig'
import { useAppSelector } from 'src/shared/store'
import MaintenancePage from 'src/features/pages/maintenance'
import ThemeSwitch from '../ui/Theme'
import StartPage from '../pages/start'
import { useLocation } from 'react-router-dom'
import { hasRole } from 'src/shared/auth'

export function ConfigProvider({ children }: { children: React.ReactNode }): JSX.Element {
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
      if (loaded || ready || isLoading.current) return
      isLoading.current = true
      await loadConfig()
      isLoading.current = false
    }
    run()
  }, [loaded, ready])

  if (showStart) {
    return (
      <ThemeSwitch>
        <StartPage />
      </ThemeSwitch>
    )
  }

  if (showMaintenance) {
    return (
      <ThemeSwitch>
        <MaintenancePage />
      </ThemeSwitch>
    )
  }

  return children as JSX.Element
}

export default ConfigProvider
