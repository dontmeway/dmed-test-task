import { routes } from '@/shared/config/routes'
import { createLazyPage } from '@/shared/lib/lazy-page'
import { withSuspense } from '@/shared/ui/with-suspense'

const load = () => import('./page')

const Page = createLazyPage({
  route: routes.home,
  load,
})

export const Home = {
  route: routes.home,
  view: withSuspense(Page),
}
