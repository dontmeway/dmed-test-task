import { notification } from 'antd'
import { createEffect } from 'effector'

export const showNotificationFx = createEffect(
  (params: { kind: 'success' | 'error'; message: string }) => {
    const options = {
      message: params.message,
      placement: 'topRight' as const,
    }

    switch (params.kind) {
      case 'success':
        return notification.success(options)
      case 'error':
        return notification.error(options)
    }
  },
)
