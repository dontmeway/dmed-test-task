import { Suspense } from 'react'
import { Spin } from 'antd'

export const withSuspense = (Component: React.FC) => {
  return () => (
    <Suspense fallback={<Spin fullscreen spinning />}>
      <Component />
    </Suspense>
  )
}
