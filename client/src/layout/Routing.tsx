import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import routes from '../shared/routes'

export default function Routing() {
  return (
    <Routes>
      {routes.map((route) => (
        <>
          <Helmet>
            {route.title && <title>{route.title}</title>}
            {route.description && (
              <meta name="description" content={route.description} />
            )}
          </Helmet>
          <Route
            key={route.path}
            path={route.path}
            element={
              <React.Suspense fallback={<>Suspense...</>}>
                <route.component />
              </React.Suspense>
            }
          />
        </>
      ))}
    </Routes>
  )
}
