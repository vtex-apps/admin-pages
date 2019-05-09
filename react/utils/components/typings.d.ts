import { JSONSchema6 } from 'json-schema'
import { RenderComponent } from 'vtex.render-runtime'

type PropsOrContent = Record<string, any>

export interface GetComponentSchemaParams {
  component: RenderComponent<any, any> | null
  contentSchema?: JSONSchema6
  propsOrContent: PropsOrContent
  runtime: RenderContext
}

export interface GetSchemaPropsOrContentParams {
  isContent?: boolean
  messages: EditorContext['messages']
  properties?: Record<string, JSONSchema6Definition>
  propsOrContent: Record<>
}

export interface GetSchemaPropsOrContentFromRuntimeParams {
  component: RenderComponent<any, any> | null
  contentSchema?: JSONSchema6
  isContent?: boolean
  messages: EditorContext['messages']
  propsOrContent: PropsOrContent
  runtime: RenderContext
}

export interface UpdateExtensionFromFormParams {
  data: object
  isContent?: boolean
  runtime: RenderContext
  treePath: string
}
