import React from 'react'
export interface AppRoute {
  path: string
  component: React.LazyExoticComponent<(props?: { [key: string]: unknown }) => JSX.Element>
  title?: string
  description?: string
  secure?: boolean
  animate?: string
  cleanLayout?: boolean
  dialog?: string
  link?: boolean
  profile?: boolean
  anon?: boolean
  hideFooter?: boolean
  params?: string[]
  roles?: string[]
}

export const Paths = {
  Login: `/login`,
  Register: `/register`,
  Draw: `/draw`,
}

export const routes: AppRoute[] = [
  {
    title: 'Home',
    path: '/',
    component: React.lazy(() => import('../features/home')),
  },
  {
    title: 'Admin',
    path: '/admin/*',
    component: React.lazy(() => import('../features/admin')),
    roles: ['admin'],
    secure: true,
    profile: true,
  },
  {
    title: 'Login',
    path: Paths.Login,
    component: React.lazy(() => import('../features/profile/Login')),
    profile: true,
    anon: true,
    dialog: 'onboard',
  },
  {
    title: 'Register',
    path: '/register',
    component: React.lazy(() => import('../features/profile/Register')),
    profile: true,
    anon: true,
    dialog: 'onboard.register',
  },
  {
    title: 'Profile',
    path: '/profile',
    component: React.lazy(() => import('../features/profile')),
    profile: true,
    secure: true,
  },
  {
    title: 'Your Canvas',
    path: Paths.Draw,
    component: React.lazy(() => import('../features/canvas')),
    secure: false,
    hideFooter: true,
    link: true,
    params: ['/:id'],
  },
  {
    title: 'Authenticating...',
    path: '/callback',
    cleanLayout: true,
    component: React.lazy(() => import('../features/profile/Callback')),
  },
  {
    title: 'Terms of Service',
    path: '/terms',
    component: React.lazy(() => import('../features/pages/terms')),
  },

  {
    title: 'Not Found',
    path: '*',
    component: React.lazy(() => import('../features/pages/404')),
  },
  {
    title: 'Offline',
    path: '/maintenance',
    cleanLayout: true,
    component: React.lazy(() => import('../features/pages/maintenance')),
  },
  {
    title: 'Start',
    path: '/start',
    cleanLayout: true,
    component: React.lazy(() => import('../features/pages/start')),
  },
]

export const currentRoute = () => routes.find(r => r.path === window.location.pathname)

export default routes
