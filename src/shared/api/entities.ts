export type Category = {
  id: number
  title: string
}

export type Product = {
  id: number
  category_id: number
  model: string
  release_year: string
  price: number
  description: string
  is_visible: 0 | 1
  image_path: string
  created_at: string
  updated_at: string
  category: Category
}
