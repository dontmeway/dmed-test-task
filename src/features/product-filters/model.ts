import { createGate } from 'effector-react'
import { debounce } from 'patronum'
import { persist } from 'effector-storage/query'
import { attach, combine, createEvent, createStore, sample } from 'effector'

import { api } from '@/shared/api'

export const Gate = createGate()

export const searchChanged = createEvent<string>()
export const categoryChanged = createEvent<string | null>()

export const filtersChanged = createEvent()

export const $search = createStore('')
export const $categoryId = createStore<string | null>(null)

export const $categories = createStore<{ value: string; label: string }[]>([])

export const $query = combine($search, $categoryId, (search, categoryId) => ({
  model: search || null,
  category_id: categoryId || null,
}))

const fetchCategoriesFx = attach({
  effect: api.fetchCategoriesFx,
})

$categories.on(fetchCategoriesFx.doneData, (_, categories) =>
  categories.map(({ id, title }) => ({ value: id.toString(), label: title })),
)

$search.on(searchChanged, (_, search) => search)
$categoryId.on(categoryChanged, (_, categoryId) => categoryId)

sample({
  clock: Gate.open,
  target: fetchCategoriesFx,
})

sample({
  clock: Gate.close,
  target: [$search.reinit, $categoryId.reinit],
})

sample({
  clock: [debounce(searchChanged, 500), categoryChanged],
  target: filtersChanged,
})

persist({
  store: $search,
  key: 'search',
})

persist({
  store: $categoryId,
  key: 'category',
})
