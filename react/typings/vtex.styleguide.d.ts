/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/class-name-casing */
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
    size?: 'small' | 'large' | 'regular'
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

  export type ShowToastFunction = (a: ShowToastOptions | string) => void

  export interface ToastConsumerFunctions {
    showToast: ShowToastFunction
    hideToast: () => void
    toastState: unknown
  }
  interface ToastConsumerProps {
    children: (mutations: ToastConsumerFunctions) => React.ReactNode
  }

  interface ConditionsStatement {
    subject: string
    verb: string
    object: Record<string, unknown>
    error: unknown
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
    extraParams: Record<string, unknown>
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
    noOptionsMessage: string
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

  interface ProgressProps {
    type: 'line' | 'steps'
    percent?: number
  }

  interface AlertProps {
    type: 'success' | 'error' | 'warning'
    children: ReactNode
    action?: {
      onClick: () => void
      label: ReactNode
    }
    autoClose?: number
    onClose?: () => void
  }

  interface ModalProps {
    children: ReactNode
    onClose: (event?: Event) => void
    bottomBar?: ReactNode
    centered?: boolean
    closeOnEsc?: boolean
    closeOnOverlayClick?: boolean
    container?: object
    isOpen?: boolean
    onCloseTransitionFinish?: () => void
    responsiveFullScreen?: boolean
    showTopBar?: boolean
    title?: ReactNode
  }

  export const ActionMenu: ComponentType<Record<string, unknown>>
  export const Alert: ComponentType<AlertProps>
  export const Box: ComponentType<Record<string, unknown>>
  export const Button: ComponentType<Record<string, unknown>>
  export const ButtonWithIcon: ComponentType<Record<string, unknown>>
  export const Card: ComponentType<Record<string, unknown>>
  export const Checkbox: ComponentType<Record<string, unknown>>
  export class DatePicker extends Component<DatePickerProps> {}
  export const ColorPicker: ComponentType<Record<string, unknown>>
  export const Dropdown: ComponentType<Record<string, unknown>>
  export const EmptyState: ComponentType<Record<string, unknown>>
  export class EXPERIMENTAL_Conditions extends Component<ConditionsProps> {}
  export class EXPERIMENTAL_Select extends Component<Record<string, unknown>> {}
  export const IconArrowBack: ComponentType<Record<string, unknown>>
  export const IconBold: ComponentType<Record<string, unknown>>
  export const IconEdit: ComponentType<Record<string, unknown>>
  export const IconCaretDown: ComponentType<Record<string, unknown>>
  export const IconCaretUp: ComponentType<Record<string, unknown>>
  export const IconCheck: ComponentType<Record<string, unknown>>
  export const IconClear: ComponentType<Record<string, unknown>>
  export const IconClose: ComponentType<Record<string, unknown>>
  export const IconDelete: ComponentType<Record<string, unknown>>
  export const IconDownload: ComponentType<Record<string, unknown>>
  export const IconItalic: ComponentType<Record<string, unknown>>
  export const IconImage: ComponentType<Record<string, unknown>>
  export const IconLink: ComponentType<Record<string, unknown>>
  export const IconOptionsDots: ComponentType<Record<string, unknown>>
  export const IconOrderedList: ComponentType<Record<string, unknown>>
  export const IconUnderline: ComponentType<Record<string, unknown>>
  export const IconUnorderedList: ComponentType<Record<string, unknown>>
  export const IconUpload: ComponentType<Record<string, unknown>>
  export const IconWarning: ComponentType<Record<string, unknown>>
  export const Input: ComponentType<Record<string, unknown>>
  export const Modal: ComponentType<ModalProps>
  export const PageHeader: ComponentType<Record<string, unknown>>
  export const Pagination: ComponentType<Record<string, unknown>>
  export class Progress extends Component<ProgressProps> {}
  export const Radio: ComponentType<Record<string, unknown>>
  export const RadioGroup: ComponentType<Record<string, unknown>>
  export const Spinner: ComponentType<Record<string, unknown>>
  export class Textarea extends Component<TextareaProps> {}
  export const Tab: ComponentType<Record<string, unknown>>
  export const Table: ComponentType<Record<string, unknown>>
  export const Tabs: ComponentType<Record<string, unknown>>
  export const Tag: ComponentType<Record<string, unknown>>
  export class ToastConsumer extends Component<ToastConsumerProps> {}
  export class ToastProvider extends Component<ToastProviderProps> {}
  export const ToastContext: React.ContextType<ToastConsumerFunctions>
  export const Toggle: ComponentType<Record<string, unknown>>
  export const Tooltip: ComponentType<Record<string, unknown>>
}
