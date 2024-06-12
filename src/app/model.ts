import { createEvent, sample } from 'effector'
import { createBrowserHistory } from 'history'

import { userModel } from '@/entities/user'
import { router } from '@/shared/config/routes'

export const appStarted = createEvent()

export const $isSessionChecking = userModel.$session.map(
  (session) =>
    session === userModel.SessionStatus.Pending || session === userModel.SessionStatus.Initial,
)

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})
