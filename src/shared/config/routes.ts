import { createHistoryRouter, createRoute, createRouterControls } from 'atomic-router'

export const routes = {
  signIn: createRoute(),
  signUp: createRoute(),
  home: createRoute(),
  signOut: createRoute(),
  notFound: createRoute(),
}

export const routesMap = [
  {
    path: '/',
    route: routes.home,
  },
  {
    path: '/sign-in',
    route: routes.signIn,
  },
  {
    path: '/sign-up',
    route: routes.signUp,
  },
  {
    path: '/sign-out',
    route: routes.signOut,
  },
]

export const routerControls = createRouterControls()

export const router = createHistoryRouter({
  routes: routesMap,
  controls: routerControls,
  notFoundRoute: routes.notFound,
})
