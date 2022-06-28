import React from 'react'

export interface AppRoute {
  path: string
  component: React.LazyExoticComponent<() => JSX.Element>
  title?: string
  description?: string
  secure?: boolean
  animate?: string
  modal?: boolean
}

export const routes: AppRoute[] = [
  {
    title: 'Home',
    path: '/',
    component: React.lazy(() => import('../pages/Home')),
  },
  {
    title: 'Login',
    path: '/login',
    component: React.lazy(() => import('../pages/Login')),
  },
]

export default routes
