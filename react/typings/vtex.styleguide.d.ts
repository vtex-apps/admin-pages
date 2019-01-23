declare module 'vtex.styleguide' {
  import { ComponentType, ReactElement } from 'react'

  export const Alert: ReactElement
  export const Box: ReactElement
  export const Button: ReactElement
  export const Card: ReactElement
  export const Checkbox: ReactElement
  export const Dropdown: ReactElement
  export const EmptyState: ReactElement
  export const IconArrowBack: ReactElement
  export const IconEdit: ReactElement
  export const IconCaretDown: ReactElement
  export const IconCaretUp: ReactElement
  export const IconClose: ReactElement
  export const Input: ReactElement
  export const Modal: ReactElement
  export const PageHeader: ReactElement
  export const Pagination: ReactElement
  export const Radio: ReactElement
  export const Spinner: ReactElement
  export const Tab: ReactElement
  export const Table: ReactElement
  export const Tabs: ReactElement
  export const Tag: ReactElement

  export type ToastConsumerRenderProps = { showToast: (text: string) => void }

  export const ToastConsumer: ComponentType<{
    children: (props: ToastConsumerRenderProps) => React.ReactNode
  }>

  type ToastProviderProps = {
    positioning: 'parent' | 'window'
  }

  export const ToastProvider: ComponentType<ToastProviderProps>

  export const Toggle: ReactElement
}
