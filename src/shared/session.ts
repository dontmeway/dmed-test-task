import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

const $token = createStore<string | null>(null)

persist({
  key: 'token',
  store: $token,
})

export const session = {
  $token,
}
