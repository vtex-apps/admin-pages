import { getBlockPath } from '../../../utils/blocks'

import { getInitialEditingState } from './BlockEditor/utils'
import { GetDefaultCondition, UpdateEditorBlockData } from './typings'

export const isUnidentifiedPageContext = (
  pageContext: RenderRuntime['route']['pageContext']
) => pageContext.type !== '*' && pageContext.id === '*'

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
  isSitewide,
  serverTreePath,
  template,
}) => {
  const {
    formState: { contentId: activeContentId },
    partialBlockData,
  } = getInitialEditingState({
    data,
    editTreePath: editor.editTreePath,
    iframeRuntime,
    intl,
    isSitewide,
  })

  editor.setBlockData({
    ...partialBlockData,
    activeContentId,
    id,
    serverTreePath,
    template,
  })
}
