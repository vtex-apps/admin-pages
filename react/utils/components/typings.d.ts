import { JSONSchema6 } from 'json-schema'
import { InjectedIntl } from 'react-intl'
import { RenderComponent } from 'vtex.render-runtime'

import { FormMetaContext } from '../../components/EditorContainer/Sidebar/typings'

type PropsOrContent = Record<string, any>

export interface GetComponentSchemaParams {
  component: RenderComponent<any, any> | null
  contentSchema?: JSONSchema6
  propsOrContent: PropsOrContent
  runtime: RenderContext
  isContent: boolean
}

export interface GetSchemaPropsOrContentParams {
  i18nMapping?: FormMetaContext['i18nMapping']
  isContent?: boolean
  messages?: RenderContext['messages']
  properties?: Record<string, JSONSchema6Definition>
  propsOrContent?: Record<string, any>
  shouldTranslate?: boolean
}

export interface GetSchemaPropsOrContentFromRuntimeParams {
  component: RenderComponent<any, any> | null
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
  treePath: string
}
