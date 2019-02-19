declare module 'vtex.styleguide' {
  import { Component, ComponentType, ReactNode } from 'react'
   // Remove this dependency from admin-pages when styleguide is properly typed.
  import { ReactDatePickerProps } from 'react-datepicker'

  type StyleguideSizes = 'small' | 'regular' | 'large'

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

  interface ToastProviderProps {
    children?: ReactNode
    positioning?: 'parent' | 'window'
  }

  interface ShowToastOptions {
    message: string
    duration?: number
    horizontalPosition?: 'right' | 'left'
  }

  export interface ToastConsumerFunctions {
    showToast: (a: ShowToastOptions | string) => void
    hideToast: () => void
  }
  interface ToastConsumerProps {
    children: (mutations: ToastConsumerFunctions) => React.ReactNode
  }

  interface Statement {
    subject: string
    verb: string
    object: any
    error: any
  }

  type ConditionsOperator = 'any' | 'all'
  interface ConditionsLabels {
    addNewCondition: string
    addConditionBtn: string
    delete: string
    noConditions: string
    operatorAll: string
    operatorAnd: string
    operatorAny: string
    operatorOr: string
    headerPrefix: string
    headerSufix: string
  }

  export interface ConditionsProps {
    canDelete?: boolean
    operator?: ConditionsOperator
    statements?: Statement[]
    options: Record<string, any>
    subjectPlaceholder: string
    isFullWidth?: boolean
    onChangeStatements?: (s: Statement[]) => void
    onChangeOperator?: (o: {operator: ConditionsOperator}) => void
    isRtl?: boolean
    showOperator?: boolean
    labels?: ConditionsLabels
  }

  interface StyleguideDatePickerCustomProps {
    error?: boolean
    errorMessage?: string
    helpText?: ReactNode
    label?: string
    locale: string
    placeholder?: string
    size?: StyleguideSizes
    value: Date
    useTime?: boolean
  }

  type DatePickerProps = Pick<ReactDatePickerProps,
    'autoFocus' |
    'disabled' |
    'excludeDates' |
    'excludeTimes' |
    'id' |
    'includeDates' |
    'includeTimes' |
    'maxDate' |
    'minDate' |
    'name' |
    'onChange' |
    'onFocus' |
    'onBlur' |
    'readOnly' |
    'required' |
    'tabIndex' |
    'timeIntervals'
  > & StyleguideDatePickerCustomProps

  export const Alert: ComponentType<any>
  export const Box: ComponentType<any>
  export const Button: ComponentType<any>
  export const Card: ComponentType<any>
  export const Checkbox: ComponentType<any>
  export class DatePicker extends Component<DatePickerProps> {}
  export const Dropdown: ComponentType<any>
  export const EmptyState: ComponentType<any>
  export class EXPERIMENTAL_Conditions extends Component<ConditionsProps>{}
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
  export class ToastConsumer extends Component<ToastConsumerProps>{}
  export class ToastProvider extends Component<ToastProviderProps>{}
}
