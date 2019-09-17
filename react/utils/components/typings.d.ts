import { JSONSchema6 } from 'json-schema'
import { RenderComponent } from 'vtex.render-runtime'

export type PropsOrContent = Extension['content'] | Extension['props']

export interface GetComponentSchemaParams {
  component: RenderComponent<unknown, unknown> | null
  contentSchema?: JSONSchema6
  propsOrContent: PropsOrContent
  runtime: RenderContext
  isContent: boolean
}

export interface GetSchemaPropsOrContentParams {
  messages?: RenderContext['messages']
  schema?: JSONSchema6Definition
  propsOrContent?: Record<string, unknown>
}

export interface GetSchemaPropsOrContentFromRuntimeParams {
  component: RenderComponent<unknown, unknown> | null
  contentSchema?: JSONSchema6
  isContent?: boolean
  messages?: RenderContext['messages']
  propsOrContent: PropsOrContent
  runtime: RenderContext
}

export interface TranslateMessageParams {
  dictionary: Record<string, string>
  id?: string
}

export interface UpdateExtensionFromFormParams {
  data: object
  isContent?: boolean
  runtime: RenderContext
  treePath: string | null
}
