import React from 'react'

export interface RouteMeta {
  path: string
  component: React.LazyExoticComponent<() => JSX.Element>
  title?: string
  description?: string
  private?: boolean
  animation?: string
}

export const routes: RouteMeta[] = [
  {
    title: 'Home',
    path: '/',
    component: React.lazy(() => import('../pages/Home')),
  },
]

export default routes
