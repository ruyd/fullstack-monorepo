import React from 'react'

export interface AppRoute {
  path: string
  component: React.LazyExoticComponent<() => JSX.Element>
  title?: string
  description?: string
  secure?: boolean
  animate?: string
  modal?: boolean
  link?: boolean
  profile?: boolean
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
    profile: true,
  },
  {
    title: 'Register',
    path: '/register',
    component: React.lazy(() => import('../pages/Register')),
    profile: true,
  },
  {
    title: 'Drawings',
    path: '/drawings',
    component: React.lazy(() => import('../pages/Drawings')),
  },
]

export default routes
