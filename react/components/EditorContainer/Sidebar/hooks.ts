import { useCallback, useEffect, useState } from 'react'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import ListContent from '../graphql/ListContent.graphql'
import { ListContentData, ListContentVariables } from '../queries/ListContent'
import { EditingState, UseInitialEditingState } from './typings'
import {
  getInitialEditingState,
  getIsSitewide,
  updateEditorBlockData,
} from './utils'

const useInitialEditingState: UseInitialEditingState = ({
  client,
  iframeRuntime,
  intl,
  showToast,
}) => {
  const editor = useEditorContext()

  const treePath = editor.editTreePath || ''

  const isSitewide = getIsSitewide(iframeRuntime.extensions, treePath)

  const blockId =
    iframeRuntime.extensions[treePath] &&
    iframeRuntime.extensions[treePath].blockId

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const serverTreePath = isSitewide ? getSitewideTreePath(treePath) : treePath

  const isEditing = editor.editTreePath !== null

  const [initialEditingState, setInitialEditingState] = useState<EditingState>()

  const fetchAndSetData = useCallback(async () => {
    try {
      const { data } = await client.query<
        ListContentData,
        ListContentVariables
      >({
        fetchPolicy: 'network-only',
        query: ListContent,
        variables: {
          bindingId: iframeRuntime.binding?.id,
          blockId,
          pageContext: iframeRuntime.route.pageContext,
          template,
          treePath: serverTreePath,
        },
      })

      setInitialEditingState(
        getInitialEditingState({
          data,
          editor,
          iframeRuntime,
        })
      )

      updateEditorBlockData({
        data,
        editor,
        id: blockId,
        iframeRuntime,
        intl,
        isSitewide,
        serverTreePath,
        template,
      })
    } catch (e) {
      showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage({
          defaultMessage: 'Something went wrong. Please try again.',
          id: 'admin/pages.editor.components.open.error',
        }),
      })

      editor.editExtensionPoint(null)
    } finally {
      editor.setIsLoading(false)
    }
  }, [
    blockId,
    client,
    editor,
    iframeRuntime,
    intl,
    isSitewide,
    serverTreePath,
    showToast,
    template,
  ])

  useEffect(() => {
    if (isEditing && !initialEditingState) {
      fetchAndSetData()
    }
  }, [isEditing, fetchAndSetData, initialEditingState])

  useEffect(() => {
    if (!isEditing && initialEditingState) {
      setInitialEditingState(undefined)
    }
  }, [isEditing, initialEditingState])

  return initialEditingState
}

export default useInitialEditingState
