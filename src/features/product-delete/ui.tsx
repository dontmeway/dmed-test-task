import { Button, Popconfirm } from 'antd'

import * as model from './model'
import { useUnit } from 'effector-react'

export const ProductDelete = ({ id }: { id: number }) => {
  const [isOpen, pending] = useUnit([model.disclosure.$isOpen, model.$pending])
  return (
    <Popconfirm
      title="Delete the product?"
      open={isOpen}
      description="Are you sure to delete this product?"
      onConfirm={() => model.confirmed()}
      onCancel={() => model.disclosure.closed()}
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
