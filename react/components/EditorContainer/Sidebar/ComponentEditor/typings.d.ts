import { JSONSchema6 } from 'json-schema'

export interface ComponentFormState {
  onClose: () => void
  onTitleChange?: () => void
  title: string
}

export interface GetSchemasArgs {
  contentSchema?: JSONSchema6
  editTreePath: string | null
  iframeRuntime: RenderContext
  isContent?: boolean
}
