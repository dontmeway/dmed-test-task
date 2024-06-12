import { Space, Input, Select } from 'antd'
import { useGate, useUnit } from 'effector-react'

import * as model from './model'
import classes from './styles.module.css'

export const ProductFilters = () => {
  useGate(model.Gate)
  const [categories, categoryId, search] = useUnit([
    model.$categories,
    model.$categoryId,
    model.$search,
  ])

  return (
    <Space>
      <Input
        className={classes.search}
        placeholder="Search (Model)"
        value={search}
        onChange={(event) => model.searchChanged(event.target.value)}
      />

      <Select
        className={classes.select}
        placeholder="Category"
        value={categoryId}
        onClear={() => model.categoryChanged(null)}
        onChange={(categoryId) => model.categoryChanged(categoryId)}
        allowClear
        options={categories}
      />
    </Space>
  )
}
