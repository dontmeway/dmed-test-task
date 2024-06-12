import { Flex } from 'antd'

import { SignInUp } from '@/features/sign-in-up'

import { signUpPageModel } from './model'
import classes from './styles.module.css'

const SignUpPage = () => {
  return (
    <Flex justify="center" align="center" className={classes.container}>
      <SignInUp action="sign-up" />
    </Flex>
  )
}

export const component = SignUpPage
export const createModel = signUpPageModel
