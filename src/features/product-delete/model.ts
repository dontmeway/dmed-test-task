import { api } from '@/shared/api'
import { showNotificationFx } from '@/shared/lib/notifications'
import { attach, createEvent, createStore, sample } from 'effector'

export const deleteTriggered = createEvent<{ id: number }>()
export const confirmed = createEvent()
export const canceled = createEvent()
export const deleted = createEvent()

export const $id = createStore<number | null>(null).reset(canceled)

const deleteFx = attach({
  effect: api.deleteProductFx,
})

export const $pending = deleteFx.pending

sample({
  clock: deleteTriggered,
  fn: ({ id }) => id,
  target: $id,
})

sample({
  clock: confirmed,
  source: deleteTriggered,
  target: deleteFx,
})

sample({
  clock: deleteFx.done,
  target: [
    $id.reinit,
    deleted,
    showNotificationFx.prepend(() => ({
      kind: 'success',
      message: 'Product deleted',
    })),
  ],
})

sample({
  clock: deleteFx.fail,
  target: showNotificationFx.prepend(() => ({
    kind: 'error',
    message: 'Something went wrong',
  })),
})
