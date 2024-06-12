import { createEffect, attach } from 'effector'

import { Category, Product } from './entities'
import { stringifyParams } from '../lib/stringify-params'
import { session } from '../session'

export const API_URL = import.meta.env.VITE_APP_API_URL

type SignInRequest = {
  username: string
  password: string
}

type SignInRequestDone = {
  token: string
}

export const signInFx = createEffect<SignInRequest, SignInRequestDone>({
  async handler(body) {
    return requestFx({
      method: 'POST',
      body,
      path: '/api/auth/sign-in',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})

type SignUpRequest = {
  username: string
  password: string
}

type SignUpRequestDone = {
  token: string
}

type SignUpRequestFail =
  | {
      message: string
    }
  | Error

export const signUpFx = createEffect<SignUpRequest, SignUpRequestDone, SignUpRequestFail>({
  async handler(body) {
    return requestFx({
      method: 'POST',
      body,
      path: '/api/auth/sign-up',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})

export const signOutFx = createEffect({
  async handler() {
    return authenticatedRequestFx({
      method: 'POST',
      path: '/api/auth/sign-out',
    })
  },
})

type MeRequestDone = {
  username: string
  id: number
}

export const fetchMeFx = createEffect<void, MeRequestDone>({
  async handler() {
    return authenticatedRequestFx({
      method: 'GET',
      path: '/api/me',
    })
  },
})

type ProductsRequest = {
  page: number
}

type ProductsRequestDone = {
  total: number
  data: Product[]
}

export const fetchProductsFx = createEffect<ProductsRequest, ProductsRequestDone>({
  async handler(params) {
    return authenticatedRequestFx({
      method: 'GET',
      path: `/api/products${stringifyParams({ params })}`,
    })
  },
})

type ProductRequest = {
  id: number
}

type ProductRequestDone = Product

export const fetchProductFx = createEffect<ProductRequest, ProductRequestDone>({
  async handler(params) {
    return authenticatedRequestFx({
      method: 'GET',
      path: `/api/products/${params.id}`,
    })
  },
})

type CreateProductRequest = FormData

type CreateProductRequestDone = {
  product: Product
}

export const createProductFx = createEffect<CreateProductRequest, CreateProductRequestDone>({
  async handler(body) {
    return authenticatedRequestFx({
      method: 'POST',
      body,
      path: '/api/products',
    })
  },
})

type UpdateProductRequest = {
  id: number
  body: FormData
}

type UpdateProductRequestDone = {
  product: Product
}

export const updateProductFx = createEffect<UpdateProductRequest, UpdateProductRequestDone>({
  async handler(params) {
    return authenticatedRequestFx({
      method: 'POST',
      body: params.body,
      path: `/api/products/${params.id}`,
    })
  },
})

type DeleteProductRequest = {
  id: number
}

export const deleteProductFx = createEffect({
  async handler(params: DeleteProductRequest) {
    return authenticatedRequestFx({
      method: 'DELETE',
      path: `/api/products/${params.id}`,
    })
  },
})

type CategoriesRequestDone = Category[]

export const fetchCategoriesFx = createEffect<void, CategoriesRequestDone>({
  async handler() {
    return authenticatedRequestFx({
      method: 'GET',
      path: '/api/categories',
    })
  },
})

type RequestParams = {
  method: RequestInit['method']
  headers?: Record<string, unknown>
  body?: unknown
  path: string
}

const requestFx = createEffect(async (params: RequestParams) => {
  const headers = params.headers ?? {}
  const body =
    contentIs(headers, 'application/json') && params.body
      ? JSON.stringify(params.body)
      : (params.body as Request['body']) || undefined

  const url = `${API_URL}${params.path}`

  const response = await fetch(url, {
    method: params.method,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    body: body,
  })

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
})

const authenticatedRequestFx = attach({
  source: session.$token,
  effect: (
    token,
    params: Omit<RequestParams, 'headers'> & { headers?: RequestInit['headers'] },
  ) => {
    if (!token) {
      throw new Error('Unauthorized')
    }

    const headers = {
      ...params.headers,
      Authorization: `Bearer ${token}`,
    }

    return requestFx({
      ...params,
      headers,
    })
  },
})

function contentIs(headers: Record<string, unknown>, type: string): boolean {
  const contentType = headers['Content-Type']

  if (typeof contentType !== 'string') {
    return false
  }

  return contentType.includes(type) ?? false
}
