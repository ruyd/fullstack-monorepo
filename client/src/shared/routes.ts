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
  hideFooter?: boolean
}

export enum Paths {
  Login = '/login',
  Draw = '/draw',
}

export const routes: AppRoute[] = [
  {
    title: 'Home',
    path: '/',
    component: React.lazy(() => import('../pages/Home')),
  },
  {
    title: 'Login',
    path: Paths.Login,
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
    title: 'Profile',
    path: '/profile',
    component: React.lazy(() => import('../pages/Profile')),
    profile: true,
    secure: true,
  },
  {
    title: 'Your Canvas',
    path: Paths.Draw,
    component: React.lazy(() => import('../pages/Draw')),
    secure: true,
    hideFooter: true,
    link: true,
  },
]

export default routes
