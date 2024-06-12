import { Typography, Input, Button, Flex } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import classes from './styles.module.css'

import * as model from './model'
import { useGate, useUnit } from 'effector-react'
import { Link } from 'atomic-router-react'
import { routes } from '@/shared/config/routes'

type Props = {
  action: 'sign-in' | 'sign-up'
}

export const SignInUp = ({ action }: Props) => {
  useGate(model.Gate, { action })
  const pending = useUnit(model.$pending)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(model.schema),
  })

  const onSubmit = (data: model.SignInUpForm) => {
    model.formValidated(data)
  }

  const title = action === 'sign-in' ? 'Sign In' : 'Sign Up'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Typography.Title level={3}>{title}</Typography.Title>

      <Flex vertical gap={32} className={classes.container}>
        <Flex vertical gap={16}>
          <Flex vertical gap={4}>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Input
                  disabled={pending}
                  placeholder="Username"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.username && (
              <Typography.Text type="danger">{errors.username.message}</Typography.Text>
            )}
          </Flex>
          <Flex vertical gap={4}>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input.Password
                  disabled={pending}
                  placeholder="Password"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.password && (
              <Typography.Text type="danger">{errors.password.message}</Typography.Text>
            )}
          </Flex>
        </Flex>

        <Button loading={pending} htmlType="submit" type="primary">
          {title}
        </Button>
        <AlternativeAction action={action} />
      </Flex>
    </form>
  )
}

const AlternativeAction = ({ action }: Pick<Props, 'action'>) => {
  const title = action === 'sign-in' ? 'Sign Up' : 'Sign In'
  const message = action === 'sign-in' ? 'Don’t have an account?' : 'Already have an account?'
  const to = action === 'sign-in' ? routes.signUp : routes.signIn
  const pending = useUnit(model.$pending)

  return (
    <Button type="link" disabled={pending}>
      <Link to={to}>
        {message} {title}
      </Link>
    </Button>
  )
}
