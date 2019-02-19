declare module 'vtex.styleguide' {
  import { Component, ComponentType } from 'react'

  interface TextareaProps
    extends React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    > {
    error?: boolean
    errorMessage?: string
    helpText?: ReactNode
    value?: string
    label?: string
  }

  export const Alert: ComponentType<any>
  export const Box: ComponentType<any>
  export const Button: ComponentType<any>
  export const Card: ComponentType<any>
  export const Checkbox: ComponentType<any>
  export const Dropdown: ComponentType<any>
  export const EmptyState: ComponentType<any>
  export const IconArrowBack: ComponentType<any>
  export const IconEdit: ComponentType<any>
  export const IconCaretDown: ComponentType<any>
  export const IconCaretUp: ComponentType<any>
  export const IconClose: ComponentType<any>
  export const Input: ComponentType<any>
  export const Modal: ComponentType<any>
  export const PageHeader: ComponentType<any>
  export const Pagination: ComponentType<any>
  export const Radio: ComponentType<any>
  export const Spinner: ComponentType<any>
  export class Textarea extends Component<TextareaProps> {}
  export const Tab: ComponentType<any>
  export const Table: ComponentType<any>
  export const Tabs: ComponentType<any>
  export const Tag: ComponentType<any>
  export const Toggle: ComponentType<any>
}
