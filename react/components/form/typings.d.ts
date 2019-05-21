import { WidgetProps } from 'react-jsonschema-form'

export interface CustomWidgetProps extends WidgetProps {
  formContext: {
    addMessages: RenderContext['addMessages']
    messages: RenderContext['messages']
    isLayout: boolean
  }
  rawErrors?: string[]
  schema: WidgetProps['schema'] & {
    disabled?: boolean
  }
}
