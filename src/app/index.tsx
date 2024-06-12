import { useUnit } from 'effector-react'
import { Spin } from 'antd'
import { RouterProvider } from 'atomic-router-react'
import '@fontsource-variable/inter'
import 'reset-css'

import { Routing } from '@/pages'
import { router } from '@/shared/config/routes'

import * as model from './model'

model.appStarted()

export const App = () => {
  const isLoading = useUnit(model.$isSessionChecking)

  if (isLoading) {
    return <Spin tip="Loading..." fullscreen spinning={isLoading} />
  }

  return (
    <RouterProvider router={router}>
      <Routing />
    </RouterProvider>
  )
}
