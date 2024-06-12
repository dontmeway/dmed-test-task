import { userModel } from '@/entities/user'
import { api } from '@/shared/api'
import { showNotificationFx } from '@/shared/lib/notifications'
import { session } from '@/shared/session'
import { attach, createEvent, merge, sample, split } from 'effector'
import { createGate } from 'effector-react'
import { pending } from 'patronum'
import * as yup from 'yup'

export type Action = 'sign-in' | 'sign-up'
export type SignInUpForm = yup.InferType<typeof schema>

export const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(8, 'Password must be at least 8 characters long'),
})

export const Gate = createGate<{
  action: Action
}>()

export const formValidated = createEvent<SignInUpForm>()
export const signedIn = createEvent()
export const signedUp = createEvent()

const signInFx = attach({ effect: api.signInFx })
const signUpFx = attach({ effect: api.signUpFx })

const authorized = merge([signInFx.doneData, signUpFx.doneData]).map(({ token }) => token)

export const $pending = pending({ effects: [signInFx, signUpFx] })
const $action = Gate.state.map(({ action }) => action ?? 'sign-in')

split({
  source: formValidated,
  match: $action,
  cases: {
    'sign-in': signInFx,
    'sign-up': signUpFx,
  },
})

sample({
  clock: [signInFx.fail, signUpFx.fail],
  filter: (error) => error instanceof Error,
  target: showNotificationFx.prepend(() => ({
    kind: 'error',
    message: 'Something went wrong',
  })),
})

sample({
  clock: [signUpFx.failData, signInFx.failData],
  filter: (error): error is { message: string } => 'message' in error,
  target: showNotificationFx.prepend<{ message: string }>(({ message }) => ({
    kind: 'error',
    message,
  })),
})

sample({
  clock: authorized,
  target: [
    showNotificationFx.prepend(() => ({
      kind: 'success',
      message: 'Success',
    })),
    userModel.loggedIn,

    session.$token,
  ],
})

split({
  source: authorized,
  match: $action,
  cases: {
    'sign-in': signedIn,
    'sign-up': signedUp,
  },
})
