import { Layout, Typography, Button } from 'antd'
import { IoIosLogOut } from 'react-icons/io'

import { routes } from '@/shared/config/routes'

import classes from './styles.module.css'

const { Header, Content } = Layout

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className={classes.layout}>
      <Header className={classes.header}>
        <Typography.Title className={classes.logo} level={3}>
          Test Task
        </Typography.Title>

        <Button type="text" icon={<IoIosLogOut />} onClick={() => routes.signOut.open()} />
      </Header>
      <Content className={classes.content}>{children}</Content>
    </Layout>
  )
}
