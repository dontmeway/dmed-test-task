import { Table, Flex, Button } from 'antd'
import { useUnit } from 'effector-react'

import { ProductCreateUpdate, productCreateUpdateModel } from '@/features/product-create-update'

import { homePageModel } from './model'
import * as lib from './lib'
import { ProductFilters } from '@/features/product-filters'

const HomePage = ({ model }: { model: ReturnType<typeof homePageModel> }) => {
  const [products, total, page, loading] = useUnit([
    model.$products,
    model.$total,
    model.$page,
    model.$pending,
  ])

  return (
    <>
      <Flex vertical gap={20}>
        <Flex justify="space-between">
          <ProductFilters />

          <Button type="primary" onClick={() => productCreateUpdateModel.createTriggered()}>
            Create Product
          </Button>
        </Flex>
        <Table
          columns={lib.columns}
          dataSource={products}
          loading={loading}
          pagination={{
            total: total,
            pageSize: 10,
            current: page,
            onChange: (changedPage) => model.pageChanged(changedPage),
          }}
        />
      </Flex>

      <ProductCreateUpdate />
    </>
  )
}

export const component = HomePage
export const createModel = homePageModel
