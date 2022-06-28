import { CircularProgress } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import config from '../shared/config'
import routes from '../shared/routes'
import AuthCheck from './AuthCheck'

export default function Routing() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <AuthCheck secure={route.secure}>
              <Helmet>
                <title>{`${route.title} - ${config.defaultTitle}`}</title>
              </Helmet>
              <React.Suspense fallback={<CircularProgress />}>
                <route.component />
              </React.Suspense>
            </AuthCheck>
          }
        />
      ))}
    </Routes>
  )
}
