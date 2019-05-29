import { JSONSchema6 } from 'json-schema'

export interface GetSchemasArgs {
  contentSchema?: JSONSchema6
  editTreePath: string | null
  iframeRuntime: RenderContext
  isContent?: boolean
}
