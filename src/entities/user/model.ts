import { createStore, sample, attach, EventCallable, createEvent, split, merge } from 'effector'
import { RouteParams, chainRoute, RouteInstance, RouteParamsAndQuery } from 'atomic-router'
import { reshape } from 'patronum'
import { api } from '@/shared/api'
import { routes } from '@/shared/config/routes'

export enum SessionStatus {
  Initial,
  Pending,
  Authorized,
  UnAuthorized,
}

export const loggedIn = createEvent()
export const loggedOut = createEvent()

export const $session = createStore(SessionStatus.Initial)

export const sessionStatus = reshape({
  source: $session,
  shape: {
    $isInitial: (status) => status === SessionStatus.Initial,
    $isAuthorized: (status) => status === SessionStatus.Authorized,
    $isUnAuthorized: (status) => status === SessionStatus.UnAuthorized,
  },
})

export const fetchMeFx = attach({ effect: api.fetchMeFx })

const authorized = fetchMeFx.doneData
const notAuthorized = fetchMeFx.failData

$session.reset([loggedIn, loggedOut])

sample({
  clock: fetchMeFx,
  filter: sessionStatus.$isInitial,
  fn: () => SessionStatus.Pending,
  target: $session,
})

sample({
  clock: authorized,
  fn: () => SessionStatus.Authorized,
  target: $session,
})

sample({
  clock: notAuthorized,
  fn: () => SessionStatus.UnAuthorized,
  target: $session,
})

type ChainOptions<Params extends RouteParams> = {
  route: RouteInstance<Params>
  otherwise?: EventCallable<void>
}

export const chainAuthorized = <Params extends RouteParams>({
  route,
  otherwise,
}: ChainOptions<Params>) => {
  const authCheckStarted = createEvent<RouteParamsAndQuery<Params>>()
  const authCheckFailed = createEvent()

  const { alreadyAuthorized, alreadyAnonymous } = split(
    sample({ clock: authCheckStarted, source: sessionStatus }),
    {
      alreadyAuthorized: (session) => session.$isAuthorized,
      alreadyAnonymous: (status) => status.$isUnAuthorized,
    },
  )

  const authCheckDone = merge([alreadyAuthorized, authorized])

  sample({
    clock: authCheckStarted,
    filter: sessionStatus.$isInitial,
    target: fetchMeFx,
  })

  sample({
    clock: [alreadyAnonymous, notAuthorized],
    filter: route.$isOpened,
    target: authCheckFailed,
  })

  if (otherwise) {
    sample({
      clock: authCheckFailed,
      target: otherwise,
    })
  } else {
    sample({
      clock: [alreadyAnonymous, notAuthorized],
      filter: route.$isOpened,
      target: routes.signIn.open,
    })
  }

  return chainRoute({
    route,
    beforeOpen: authCheckStarted,
    openOn: authCheckDone,
    cancelOn: [authCheckFailed],
  })
}

export const chainAnonymous = <Params extends RouteParams>({
  route,
  otherwise,
}: ChainOptions<Params>) => {
  const authCheckStarted = createEvent<RouteParamsAndQuery<Params>>()
  const authCheckDone = createEvent()

  const { alreadyAuthorized, alreadyAnonymous } = split(
    sample({ clock: authCheckStarted, source: sessionStatus }),
    {
      alreadyAuthorized: (session) => session.$isAuthorized,
      alreadyAnonymous: (status) => status.$isUnAuthorized,
    },
  )

  sample({
    clock: authCheckStarted,
    filter: sessionStatus.$isInitial,
    target: fetchMeFx,
  })

  sample({
    clock: [alreadyAuthorized, authorized],
    filter: route.$isOpened,
    target: authCheckDone,
  })

  if (otherwise) {
    sample({
      clock: authCheckDone,
      target: otherwise,
    })
  } else {
    sample({
      clock: [alreadyAuthorized, authorized],
      filter: route.$isOpened,
      target: routes.home.open,
    })
  }

  return chainRoute({
    route,
    beforeOpen: authCheckStarted,
    openOn: [alreadyAnonymous, notAuthorized],
    cancelOn: authCheckDone,
  })
}
