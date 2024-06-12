import { routes } from '@/shared/config/routes'
import { createLazyPage } from '@/shared/lib/lazy-page'
import { withSuspense } from '@/shared/ui/with-suspense'

const load = () => import('./page')

const route = routes.notFound

const Page = createLazyPage({
  route,
  load,
})

export const NotFound = {
  route,
  view: withSuspense(Page),
}
