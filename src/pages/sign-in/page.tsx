import { Flex } from 'antd'

import { SignInUp } from '@/features/sign-in-up'

import { signInPageModel } from './model'
import classes from './styles.module.css'

const SignInPage = () => {
  return (
    <Flex justify="center" align="center" className={classes.container}>
      <SignInUp action="sign-in" />
    </Flex>
  )
}

export const component = SignInPage
export const createModel = signInPageModel
