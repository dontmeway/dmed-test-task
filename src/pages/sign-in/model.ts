import { RouteInstance } from 'atomic-router'

import { userModel } from '@/entities/user'
import { sample } from 'effector'
import { signInUpModel } from '@/features/sign-in-up'
import { routes } from '@/shared/config/routes'

export const signInPageModel = ({ route }: { route: RouteInstance<Record<string, never>> }) => {
  const anonymousRoute = userModel.chainAnonymous({
    route,
  })

  sample({
    clock: signInUpModel.signedIn,
    target: routes.home.open,
  })

  return {
    anonymousRoute,
  }
}
