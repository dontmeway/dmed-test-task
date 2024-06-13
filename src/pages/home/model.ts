import { RouteInstance } from 'atomic-router'
import { spread } from 'patronum'
import { attach, createEvent, createStore, sample } from 'effector'

import { productCreateUpdateModel } from '@/features/product-create-update'
import { productDeleteModel } from '@/features/product-delete'
import { productFiltersModel } from '@/features/product-filters'
import { userModel } from '@/entities/user'
import { Product, api } from '@/shared/api'

export const homePageModel = ({ route }: { route: RouteInstance<Record<string, never>> }) => {
  const authorizedRoute = userModel.chainAuthorized({ route })

  const pageChanged = createEvent<number>()

  const $page = createStore(1)
  const $total = createStore(0)
  const $products = createStore<Product[]>([])

  const fetchProductsFx = attach({
    effect: api.fetchProductsFx,
    source: {
      page: $page,

      filters: productFiltersModel.$query,
    },
    mapParams: (_: void, { page, filters }) => ({ page, ...filters }),
  })

  const $pending = fetchProductsFx.pending

  $page.on(pageChanged, (_, page) => page).reset(productFiltersModel.filtersChanged)

  sample({
    clock: [
      authorizedRoute.opened,
      pageChanged,
      productCreateUpdateModel.successFullyMutated,
      productDeleteModel.deleted,
      productFiltersModel.filtersChanged,
    ],
    filter: authorizedRoute.$isOpened,
    target: fetchProductsFx,
  })

  sample({
    clock: fetchProductsFx.doneData,
    fn: ({ data, total }) => ({
      products: data.map((product) => ({ key: product.id.toString(), ...product })),
      total,
    }),
    target: spread({
      products: $products,
      total: $total,
    }),
  })

  sample({
    clock: authorizedRoute.closed,
    target: [$products.reinit, $page.reinit, $total.reinit],
  })

  return {
    $products,
    $page,
    $total,
    $pending,

    pageChanged,
  }
}
