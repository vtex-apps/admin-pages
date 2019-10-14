import { formatIOMessage } from 'vtex.native-types'

import { getBlockPath } from '../../../utils/blocks'
import {
  getActiveContentId,
  getComponentSchema,
  getExtension,
  getIframeImplementation,
  getSchemaPropsOrContentFromRuntime,
} from '../../../utils/components'

import {
  GetDefaultCondition,
  GetFormData,
  GetInitialEditingState,
  UpdateEditorBlockData,
} from './typings'

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

export const getDefaultCondition: GetDefaultCondition = ({
  iframeRuntime,
  isSitewide,
}) => {
  const iframePageContext = iframeRuntime.route.pageContext

  const pageContext: ExtensionConfiguration['condition']['pageContext'] = isSitewide
    ? {
        id: '*',
        type: '*',
      }
    : {
        id: isUnidentifiedPageContext(iframePageContext)
          ? '*'
          : iframePageContext.id,
        type: iframePageContext.type,
      }

  return {
    allMatches: true,
    id: '',
    pageContext,
    statements: [],
  }
}

export const getFormData: GetFormData = ({
  componentImplementation,
  content,
  contentSchema,
  iframeRuntime,
}) =>
  getSchemaPropsOrContentFromRuntime({
    component: componentImplementation,
    contentSchema,
    isContent: true,
    messages: iframeRuntime.messages,
    propsOrContent: content,
    runtime: iframeRuntime,
  }) || {}

export const getInitialEditingState: GetInitialEditingState = ({
  data,
  editor,
  iframeRuntime,
}) => {
  const treePath = editor.editTreePath || ''

  const extension = getExtension(treePath, iframeRuntime.extensions)

  const componentImplementation = getIframeImplementation(extension.component)

  const listContent = data && data.listContentWithSchema

  const contentSchema = listContent && JSON.parse(listContent.schemaJSON)

  const configurations = listContent && listContent.content

  const activeContentId = getActiveContentId({
    extensions: iframeRuntime.extensions,
    treePath: editor.editTreePath,
  })

  const activeContent =
    configurations &&
    configurations.find(
      configuration => configuration.contentId === activeContentId
    )

  const content =
    (activeContent &&
      activeContent.contentJSON &&
      JSON.parse(activeContent.contentJSON)) ||
    {}

  const condition = activeContent
    ? activeContent.condition
    : getDefaultCondition({
        iframeRuntime,
        isSitewide: editor.blockData.isSitewide,
      })

  const label = activeContent && activeContent.label

  const formData = getFormData({
    componentImplementation,
    content,
    contentSchema,
    iframeRuntime,
  })

  return {
    condition,
    contentId: activeContentId,
    content,
    formData,
    label,
  }
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

  const blockData = {
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
