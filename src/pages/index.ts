import { createRoutesView } from 'atomic-router-react'

import { AppShell } from '@/shared/ui/layout'

import { SignIn } from './sign-in'
import { Home } from './home'
import { SignUp } from './sign-up'
import { SignOut } from './sign-out'
import { NotFound } from './404'

export const Routing = createRoutesView({
  routes: [
    {
      view: Home.view,
      route: Home.route,
      layout: AppShell,
    },
    {
      view: SignIn.view,
      route: SignIn.route,
    },
    {
      view: SignUp.view,
      route: SignUp.route,
    },
    {
      view: SignOut.view,
      route: SignOut.route,
    },
    {
      view: NotFound.view,
      route: NotFound.route,
    },
  ],
})
