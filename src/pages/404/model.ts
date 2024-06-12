import { RouteInstance } from 'atomic-router'

import { userModel } from '@/entities/user'

export const notFoundPageModel = ({ route }: { route: RouteInstance<Record<string, never>> }) => {
  const authorizedRoute = userModel.chainAuthorized({
    route,
  })

  return {
    authorizedRoute,
  }
}
