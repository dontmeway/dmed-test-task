import { Spin } from 'antd'

import { signOutPageModel } from './model'

const SignOutPage = () => {
  return <Spin tip="Signing out..." fullscreen spinning />
}

export const component = SignOutPage
export const createModel = signOutPageModel
