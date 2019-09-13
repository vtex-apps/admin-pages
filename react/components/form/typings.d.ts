import { WidgetProps } from 'react-jsonschema-form'

export interface CustomWidgetProps<T = unknown> extends WidgetProps {
  formContext: {
    messages: RenderContext['messages']
    isLayout: boolean
  }
  onChange: (value: unknown, target?: React.ChangeEvent<T>['target']) => void
  rawErrors?: string[]
  schema: WidgetProps['schema'] & {
    disabled?: boolean
  }
}
