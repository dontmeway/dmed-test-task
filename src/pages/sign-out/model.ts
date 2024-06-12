import { RouteInstance } from 'atomic-router'
import { attach, sample } from 'effector'

import { userModel } from '@/entities/user'
import { routes } from '@/shared/config/routes'
import { api } from '@/shared/api'

export const signOutPageModel = ({ route }: { route: RouteInstance<Record<string, never>> }) => {
  const authorizedRoute = userModel.chainAuthorized({
    route,
  })

  const signOutFx = attach({ effect: api.signOutFx })

  sample({
    clock: authorizedRoute.opened,
    target: signOutFx,
  })

  sample({
    clock: signOutFx.done,
    target: [routes.signIn.open, userModel.loggedOut],
  })
}
