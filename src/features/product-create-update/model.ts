import { attach, createEffect, createEvent, createStore, sample, split } from 'effector'
import { UseFormReset } from 'react-hook-form'
import { createGate } from 'effector-react'
import { pending } from 'patronum'
import * as yup from 'yup'

import { Product, api } from '@/shared/api'
import { createDisclosure } from '@/shared/lib/disclosure'
import { showNotificationFx } from '@/shared/lib/notifications'

export type ProductForm = yup.InferType<typeof schema>
export type Action = 'create' | 'update'

export const Gate = createGate<{
  setForm: UseFormReset<ProductForm> | null
}>()

export const schema = yup.object().shape({
  model: yup.string().required('Required field'),
  release_year: yup.string().required('Required field'),
  category_id: yup.string().required('Required field'),
  price: yup.number().positive().required('Required field'),
  description: yup.string().required('Required field'),
  is_visible: yup.boolean(),
})

export const createTriggered = createEvent()
export const editTriggered = createEvent<{ id: number }>()

export const successFullyMutated = createEvent()

export const disclosure = createDisclosure()

export const formValidated = createEvent<ProductForm>()
export const imageUploaded = createEvent<File | null>()

const $id = createStore<number | null>(null)
export const $action = createStore<Action>('create')
export const $image = createStore<File | null | string>(null)

export const $categories = createStore<{ value: string; label: string }[]>([])

const $categoriesNotFetched = $categories.map((categories) => categories.length === 0)

const fetchCategoriesFx = attach({
  effect: api.fetchCategoriesFx,
})

const createProductFx = attach({
  effect: api.createProductFx,
  source: $image,
  mapParams: mapParams,
})

const updateProductFx = attach({
  effect: api.updateProductFx,
  source: {
    image: $image,
    id: $id,
  },
  mapParams: (form: ProductForm, { image, id }) => {
    if (!id) throw new Error('ID is required')

    return {
      body: mapParams(form, image),
      id,
    }
  },
})

const fetchProductFx = createEffect(api.fetchProductFx)

const setFormInitialValuesFx = attach({
  source: Gate.state,
  effect: (state, product: Product) => {
    if (state.setForm) {
      state.setForm({
        model: product.model,
        release_year: product.release_year,
        category_id: product.category_id.toString(),
        price: product.price,
        description: product.description,
        is_visible: !!product.is_visible,
      })
    }
  },
})

const resetFormValuesFx = attach({
  source: Gate.state,
  effect: (state) => {
    if (state.setForm) {
      state.setForm({
        model: undefined,
        release_year: undefined,
        category_id: undefined,
        price: undefined,
        description: undefined,
        is_visible: undefined,
      })
    }
  },
})

export const $pending = pending({
  effects: [createProductFx, updateProductFx, fetchProductFx, setFormInitialValuesFx],
})

$action.on(editTriggered, () => 'update').on(createTriggered, () => 'create')
$id.on(editTriggered, (_, { id }) => id)
$image
  .on(imageUploaded, (_, image) => image)
  .on(fetchProductFx.doneData, (_, product) => `${api.API_URL}/${product.image_path}`)
  .reset(disclosure.closed)
$categories.on(fetchCategoriesFx.doneData, (_, categories) =>
  categories.map((category) => ({
    label: category.title,
    value: category.id.toString(),
  })),
)

sample({
  clock: editTriggered,
  target: fetchProductFx,
})

sample({
  clock: fetchProductFx.doneData,
  target: setFormInitialValuesFx,
})

sample({
  clock: [createTriggered, editTriggered],
  target: disclosure.opened,
})

sample({
  clock: disclosure.opened,
  filter: $categoriesNotFetched,
  target: fetchCategoriesFx,
})

split({
  source: formValidated,
  match: $action,
  cases: {
    create: createProductFx,
    update: updateProductFx,
  },
})

sample({
  clock: [createProductFx.done, updateProductFx.done],
  target: [
    disclosure.closed,
    successFullyMutated,
    showNotificationFx.prepend(() => ({
      kind: 'success',
      message: 'Success',
    })),
  ],
})

sample({
  clock: [createProductFx.fail, updateProductFx.fail],
  target: showNotificationFx.prepend(() => ({
    kind: 'error',
    message: 'Something went wrong',
  })),
})

sample({
  clock: disclosure.closed,
  target: resetFormValuesFx,
})

function mapParams(data: ProductForm, image: File | null | string): FormData {
  const formData = new FormData()

  formData.append('model', data.model)
  formData.append('release_year', data.release_year.toString())
  formData.append('category_id', data.category_id)
  formData.append('price', data.price.toString())
  formData.append('description', data.description)
  formData.append('is_visible', data.is_visible ? '1' : '0')

  if (image && typeof image !== 'string') {
    formData.append('image', image)
  }

  return formData
}
