import React from 'react'
export interface AppRoute {
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.LazyExoticComponent<(props: any) => JSX.Element>
  title?: string
  description?: string
  secure?: boolean
  animate?: string
  popup?: boolean
  dialog?: string
  link?: boolean
  profile?: boolean
  anon?: boolean
  hideFooter?: boolean
  params?: string[]
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
    component: React.lazy(() => import('../features/profile/Edit')),
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
    popup: true,
    component: React.lazy(() => import('../features/profile/Callback')),
  },
  {
    title: 'Not Found',
    path: '*',
    component: React.lazy(() => import('../features/pages/404')),
  },
]

export const currentRoute = () => routes.find(r => r.path === window.location.pathname)

export default routes
