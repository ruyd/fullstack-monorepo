import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import { AppRoute } from '../../shared/routes'

export const routes: AppRoute[] = [
  {
    title: 'Dashboard',
    path: '/',
    component: React.lazy(() => import('./')),
  },
  {
    title: 'Data',
    path: '/data',
    component: React.lazy(() => import('./Data')),
  },
]

export const RouteElement = ({ route }: { route: AppRoute }) => (
  <>
    <Helmet>
      <title>{`${route.title}`}</title>
    </Helmet>
    <route.component />
  </>
)

export default function Routing() {
  return (
    <Routes>
      {routes.map(route => (
        <Route key={route.path} path={route.path} element={<RouteElement route={route} />} />
      ))}
    </Routes>
  )
}
