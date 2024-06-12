import { api } from '@/shared/api'
import { createDisclosure } from '@/shared/lib/disclosure'
import { showNotificationFx } from '@/shared/lib/notifications'
import { attach, createEvent, sample } from 'effector'

export const disclosure = createDisclosure()

export const deleteTriggered = createEvent<{ id: number }>()
export const confirmed = createEvent()
export const deleted = createEvent()

const deleteFx = attach({
  effect: api.deleteProductFx,
})

export const $pending = deleteFx.pending

sample({
  clock: deleteTriggered,
  target: disclosure.opened,
})

sample({
  clock: confirmed,
  source: deleteTriggered,
  target: deleteFx,
})

sample({
  clock: deleteFx.done,
  target: [
    disclosure.closed,
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
