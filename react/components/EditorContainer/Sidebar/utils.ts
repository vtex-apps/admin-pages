import { formatIOMessage } from 'vtex.native-types'

import { getBlockPath } from '../../../utils/blocks'
import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
} from '../../../utils/components'

import { UpdateEditorBlockData } from './typings'

export const isUnidentifiedPageContext = (
  pageContext: RenderRuntime['route']['pageContext']
) => pageContext.type !== '*' && pageContext.id === '*'

export const getIsSitewide = (
  extensions: Extensions,
  editTreePath: EditorContextType['editTreePath']
) => {
  const blockPath = getBlockPath(extensions, editTreePath)

  return (
    (blockPath.length > 0 &&
      ['AFTER', 'AROUND', 'BEFORE'].includes(blockPath[1].role)) ||
    false
  )
}

export const updateEditorBlockData: UpdateEditorBlockData = ({
  data,
  editor,
  id,
  iframeRuntime,
  intl,
  serverTreePath,
  template,
}) => {
  const treePath = editor.editTreePath || ''

  const extension = getExtension(treePath, iframeRuntime.extensions)

  const listContent = data && data.listContentWithSchema

  const componentImplementation = getIframeImplementation(extension.component)

  const contentSchema = listContent && JSON.parse(listContent.schemaJSON)

  const componentSchema = getComponentSchema({
    component: componentImplementation,
    contentSchema: contentSchema,
    isContent: true,
    propsOrContent: extension.content,
    runtime: iframeRuntime,
  })

  const title = formatIOMessage({ id: componentSchema.title || '', intl })

  const configurations = listContent && listContent.content

  const activeContentId = extension.contentIds[extension.contentIds.length - 1]

  const blockData = {
    activeContentId,
    componentImplementation,
    componentSchema,
    configurations,
    contentSchema,
    id,
    serverTreePath,
    template,
    title,
  }

  editor.setBlockData(blockData)
}
