/* tslint:disable:max-classes-per-file class-name*/
declare module 'vtex.styleguide' {
  import { ReactDatePickerProps } from '@types/react-datepicker'
  import { Component, ComponentType, CSSProperties, ReactNode } from 'react'

  type StyleguideSizes = 'small' | 'regular' | 'large'

  interface TextareaProps
    extends React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    > {
    error?: boolean
    errorMessage?: string
    helpText?: ReactNode
    resize?: CSSProperties['resize']
    value?: string
    label?: string
  }

  interface ToastProviderProps {
    children?: ReactNode
    positioning?: 'parent' | 'window'
  }

  interface ShowToastOptions {
    action?: {
      label: string
      onClick: () => void
    }
    message: string
    duration?: number
    horizontalPosition?: 'right' | 'left'
  }

  export interface ToastConsumerFunctions {
    showToast: (a: ShowToastOptions | string) => void
    hideToast: () => void
    toastState: any
  }
  interface ToastConsumerProps {
    children: (mutations: ToastConsumerFunctions) => React.ReactNode
  }

  interface ConditionsStatement {
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

  interface ConditionsRenderFnArg {
    statementIndex: number
    statements: ConditionsStatement[]
    isFullWidth: boolean
    values: ConditionsStatement['object']
    error: string | null
    extraParams: ConditionOptionObject['extraParams']
  }

  export type ConditionsRenderFn = (arg: ConditionsRenderFnArg) => ReactElement

  interface ConditionOptionObject {
    renderFn: ConditionsRenderFn
    extraParams: Record<string, any>
  }

  interface ConditionsOptionVerb {
    label: string
    value: string
    object: ConditionOptionObject
  }

  export interface ConditionsOptions {
    label: string
    unique?: boolean
    verbs: ConditionsOptionVerb[]
  }

  export interface ConditionsProps {
    canDelete?: boolean
    operator?: ConditionsOperator
    statements?: ConditionsStatement[]
    options: Record<string, ConditionsOptions>
    subjectPlaceholder: string
    isFullWidth?: boolean
    onChangeStatements?: (s: ConditionsStatement[]) => void
    onChangeOperator?: (o: { operator: ConditionsOperator }) => void
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
    value?: Date
    useTime?: boolean
  }

  type DatePickerProps = Pick<
    | ReactDatePickerProps
    | 'autoFocus'
    | 'disabled'
    | 'excludeDates'
    | 'excludeTimes'
    | 'id'
    | 'includeDates'
    | 'includeTimes'
    | 'maxDate'
    | 'minDate'
    | 'name'
    | 'onChange'
    | 'onFocus'
    | 'onBlur'
    | 'readOnly'
    | 'required'
    | 'tabIndex'
    | 'timeIntervals'
  > &
    StyleguideDatePickerCustomProps

  export const ActionMenu: ComponentType<any>
  export const Alert: ComponentType<any>
  export const Box: ComponentType<any>
  export const Button: ComponentType<any>
  export const ButtonWithIcon: ComponentType<any>
  export const Card: ComponentType<any>
  export const Checkbox: ComponentType<any>
  export class DatePicker extends Component<DatePickerProps> {}
  export const ColorPicker: ComponentType<any>
  export const Dropdown: ComponentType<any>
  export const EmptyState: ComponentType<any>
  export class EXPERIMENTAL_Conditions extends Component<ConditionsProps> {}
  export class EXPERIMENTAL_Select extends Component<any> {}
  export const IconArrowBack: ComponentType<any>
  export const IconEdit: ComponentType<any>
  export const IconCaretDown: ComponentType<any>
  export const IconCaretUp: ComponentType<any>
  export const IconClear: ComponentType<any>
  export const IconClose: ComponentType<any>
  export const IconOptionsDots: ComponentType<any>
  export const IconUpload: ComponentType<any>
  export const Input: ComponentType<any>
  export const Modal: ComponentType<any>
  export const PageHeader: ComponentType<any>
  export const Pagination: ComponentType<any>
  export const Radio: ComponentType<any>
  export const RadioGroup: ComponentType<any>
  export const Spinner: ComponentType<any>
  export class Textarea extends Component<TextareaProps> {}
  export const Tab: ComponentType<any>
  export const Table: ComponentType<any>
  export const Tabs: ComponentType<any>
  export const Tag: ComponentType<any>
  export class ToastConsumer extends Component<ToastConsumerProps> {}
  export class ToastProvider extends Component<ToastProviderProps> {}
  export const ToastContext: React.ContextType<ToastConsumerFunctions>
  export const Toggle: ComponentType<any>
}
