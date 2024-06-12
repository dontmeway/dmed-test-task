import { RouteInstance } from 'atomic-router'

import { userModel } from '@/entities/user'
import { attach, createEvent, createStore, sample } from 'effector'
import { Product, api } from '@/shared/api'
import { spread } from 'patronum'
import { productCreateUpdateModel } from '@/features/product-create-update'
import { productDeleteModel } from '@/features/product-delete'
import { productFiltersModel } from '@/features/product-filters'

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

  $page.on(pageChanged, (_, page) => page)

  sample({
    clock: [
      authorizedRoute.opened,
      $page,
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
      products: data,
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
