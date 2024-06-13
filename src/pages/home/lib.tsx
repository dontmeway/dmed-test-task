import { TableProps, Space, Button, Avatar } from 'antd'

import { Category, Product, api } from '@/shared/api'
import { productCreateUpdateModel } from '@/features/product-create-update'
import { ProductDelete } from '@/features/product-delete'

export const columns: TableProps<Product>['columns'] = [
  {
    dataIndex: 'image_path',
    title: 'Image',
    key: 'image_path',
    render: (value: string) => <Avatar src={`${api.API_URL}/${value}`} />,
  },
  {
    dataIndex: 'model',
    title: 'Model',
    key: 'model',
  },
  {
    dataIndex: 'release_year',
    title: 'Release Year',
    key: 'release_year',
  },
  {
    dataIndex: 'category',
    title: 'Category',
    render: (value: Category) => value.title,
    key: 'category',
  },
  {
    dataIndex: 'price',
    title: 'Price',
    key: 'price',
    render: (value: number) => `$${value}`,
  },
  {
    dataIndex: 'created_at',
    title: 'Created At',
    key: 'created_at',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    dataIndex: 'is_visible',
    title: 'Visibility',
    key: 'is_visible',
    render: (value: Product['is_visible']) => (value ? 'Visible' : 'Hidden'),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button
          size="small"
          type="primary"
          onClick={() => productCreateUpdateModel.editTriggered({ id: record.id })}
        >
          Edit
        </Button>
        <ProductDelete id={record.id} />
      </Space>
    ),
  },
]
