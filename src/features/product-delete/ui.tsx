import { Button, Popconfirm } from 'antd'

import * as model from './model'
import { useUnit } from 'effector-react'

export const ProductDelete = ({ id }: { id: number }) => {
  const [selectedId, pending] = useUnit([model.$id, model.$pending])
  return (
    <Popconfirm
      title="Delete the product?"
      open={selectedId === id}
      description="Are you sure to delete this product?"
      onConfirm={() => model.confirmed()}
      onCancel={() => model.canceled()}
      okText="Yes"
      cancelText="No"
      disabled={pending}
    >
      <Button size="small" disabled={pending} onClick={() => model.deleteTriggered({ id })} danger>
        Delete
      </Button>
    </Popconfirm>
  )
}
