import { Link } from 'atomic-router-react'
import { Button, Flex, Typography } from 'antd'

import { routes } from '@/shared/config/routes'

import { notFoundPageModel } from './model'
import classes from './styles.module.css'

const NotFoundPage = () => {
  return (
    <Flex justify="center" align="center" vertical className={classes.container}>
      <Typography.Title level={1}>404 - Page Not Found</Typography.Title>

      <Button type="primary">
        <Link to={routes.home}>Go to Home</Link>
      </Button>
    </Flex>
  )
}

export const component = NotFoundPage
export const createModel = notFoundPageModel
