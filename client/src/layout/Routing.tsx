import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
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
                <title>{route.title}</title>
              </Helmet>
              <React.Suspense fallback={<>Suspense...</>}>
                <route.component />
              </React.Suspense>
            </AuthCheck>
          }
        />
      ))}
    </Routes>
  )
}
