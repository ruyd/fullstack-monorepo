import React from 'react'
import loadConfig from '../../shared/loadConfig'
import { useAppSelector } from '../../shared/store'
import MaintenancePage from '../../features/pages/Maintenance'
import StartPage from '../../features/pages/Start'
import { useLocation } from 'react-router-dom'
import { hasRole } from '../../shared/auth'
import { Config } from 'src/shared/config'
import { useQuery } from 'react-query'

export function ConfigProvider({ children }: { children: React.ReactElement }): JSX.Element {
  const location = useLocation()
  const loaded = useAppSelector(state => state.app.loaded)
  const ready = useAppSelector(state => state.app.ready)
  const token = useAppSelector(state => state.app.token)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading } = useQuery<Config>('config', () => loadConfig())
  const maintenance = useAppSelector(state => state.app.settings?.system?.disable)
  const showStart = loaded && !ready
  const showMaintenance =
    maintenance && (!token || !hasRole('admin')) && location.pathname !== '/login'

  if (showStart) {
    return <StartPage />
  }

  if (showMaintenance) {
    return <MaintenancePage />
  }

  return children
}

export default ConfigProvider
