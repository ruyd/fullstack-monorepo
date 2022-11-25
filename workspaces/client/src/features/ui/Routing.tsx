import { CircularProgress } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import config from '../../shared/config'
import routes, { AppRoute } from '../../shared/routes'
import AuthCheck from '../profile/AuthCheck'

export const RouteElement = ({ route }: { route: AppRoute }) => (
  <AuthCheck secure={route.secure}>
    <Helmet>
      <title>{`${route.title} - ${config.defaultTitle}`}</title>
    </Helmet>
    <React.Suspense fallback={<CircularProgress />}>
      <route.component />
    </React.Suspense>
  </AuthCheck>
)

export default function Routing() {
  return (
    <Routes>
      {routes.map(route => (
        <Route key={route.path} path={route.path} element={<RouteElement route={route} />} />
      ))}
      {routes
        .filter(r => !!r.params)
        .map(route =>
          route.params?.map(pathParam => (
            <Route
              key={route.path + pathParam}
              path={route.path + pathParam}
              element={<RouteElement route={route} />}
            />
          )),
        )}
    </Routes>
  )
}
