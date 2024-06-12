import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import {
  Flex,
  Typography,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Checkbox,
  Upload,
  Button,
  Modal,
  Space,
  Spin,
} from 'antd'
import { MdFileUpload } from 'react-icons/md'
import dayjs from 'dayjs'

import * as model from './model'
import { useGate, useUnit } from 'effector-react'

export const ProductCreateUpdate = () => {
  const [categories, isOpen, action] = useUnit([
    model.$categories,
    model.disclosure.$isOpen,
    model.$action,
  ])

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(model.schema),
  })

  useGate(model.Gate, { setForm: reset })

  const onSubmit = (data: model.ProductForm) => {
    model.formValidated(data)
  }
  const pending = false

  const title = action === 'create' ? 'Create Product' : 'Update Product'

  return (
    <Modal
      title={title}
      onCancel={() => model.disclosure.closed()}
      footer={[
        <Button disabled={pending} key="cancel" onClick={() => model.disclosure.closed()}>
          Cancel
        </Button>,
        <Button
          loading={pending}
          disabled={!isDirty || !isValid}
          key="submit"
          htmlType="submit"
          type="primary"
          form="create-update-form"
        >
          Submit
        </Button>,
      ]}
      open={isOpen}
    >
      <Spin spinning={pending}>
        <form id="create-update-form" onSubmit={handleSubmit(onSubmit)}>
          <Flex vertical gap={16}>
            <ImageField />

            <WithError error={errors.model?.message}>
              <Controller
                shouldUnregister
                control={control}
                name="model"
                render={({ field }) => (
                  <Input
                    disabled={pending}
                    placeholder="Model"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </WithError>

            <WithError error={errors.release_year?.message}>
              <Controller
                shouldUnregister
                control={control}
                name="release_year"
                render={({ field }) => (
                  <DatePicker
                    disabled={pending}
                    placeholder="Release Year"
                    value={field.value ? dayjs().year(+field.value) : undefined}
                    onChange={(_, year) => field.onChange(year)}
                    picker="year"
                  />
                )}
              />
            </WithError>

            <WithError error={errors.category_id?.message}>
              <Controller
                shouldUnregister
                control={control}
                name="category_id"
                render={({ field }) => (
                  <Select
                    placeholder="Category"
                    value={field.value}
                    onChange={field.onChange}
                    options={categories}
                    disabled={pending}
                  />
                )}
              />
            </WithError>

            <WithError error={errors.description?.message}>
              <Controller
                shouldUnregister
                control={control}
                name="description"
                render={({ field }) => (
                  <Input.TextArea
                    rows={4}
                    disabled={pending}
                    placeholder="Description"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </WithError>

            <Space>
              <WithError error={errors.price?.message}>
                <Controller
                  shouldUnregister
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <InputNumber<number>
                      value={field.value}
                      placeholder="Price"
                      disabled={pending}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                      onChange={field.onChange}
                    />
                  )}
                />
              </WithError>

              <WithError error={errors.is_visible?.message}>
                <Controller
                  shouldUnregister
                  control={control}
                  name="is_visible"
                  render={({ field }) => (
                    <Checkbox onChange={field.onChange} disabled={pending} checked={field.value}>
                      Is visible
                    </Checkbox>
                  )}
                />
              </WithError>
            </Space>
          </Flex>
        </form>
      </Spin>
    </Modal>
  )
}

const ImageField = () => {
  const [image, pending] = useUnit([model.$image, model.$pending])

  const fileList = image
    ? [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done' as const,
          url: typeof image === 'string' ? image : URL.createObjectURL(image),
        },
      ]
    : []

  return (
    <>
      <Upload
        listType="picture-card"
        customRequest={() => {}}
        disabled={pending}
        fileList={fileList}
        onChange={({ file }) => model.imageUploaded(file.originFileObj as File)}
        onRemove={() => {
          model.imageUploaded(null)
        }}
      >
        {fileList.length === 0 && (
          <Button type="text" icon={<MdFileUpload />} htmlType="button">
            Upload
          </Button>
        )}
      </Upload>
    </>
  )
}

const WithError = ({ children, error }: { children: React.ReactNode; error?: string }) => {
  return (
    <Flex vertical gap={4}>
      {children}
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </Flex>
  )
}
