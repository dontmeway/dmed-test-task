import { routes } from '@/shared/config/routes'
import { createLazyPage } from '@/shared/lib/lazy-page'
import { withSuspense } from '@/shared/ui/with-suspense'

const load = () => import('./page')

const route = routes.signUp

const Page = createLazyPage({
  route,
  load,
})

export const SignUp = {
  route,
  view: withSuspense(Page),
}
