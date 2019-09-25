import { useCallback } from 'react'

import { useEditorContext } from '../../../../EditorContext'
import { getIsDefaultContent } from '../utils'

import { UseListHandlers } from './typings'

export const useListHandlers: UseListHandlers = ({
  deleteContent,
  iframeRuntime,
  intl,
  onBack,
  showToast,
}) => {
  const editor = useEditorContext()

  // TODO
  //     if (isUnidentifiedPageContext(pageContext)) {
  //       showToast({
  //         horizontalPosition: 'right',
  //         message: intl.formatMessage(
  //           {
  //             id: messages.pageContextError.id,
  //           },
  //           {
  //             entity: intl.formatMessage({
  //               id: `admin/pages.editor.components.condition.scope.entity.${pageContext.type}`,
  //             }),
  //             template: intl.formatMessage({
  //               id: 'admin/pages.editor.components.condition.scope.template',
  //             }),
  //           }
  //         ),
  //       })
  //     }

  // TODO
  const handleConfigurationDeletion = useCallback(
    async (configuration: ExtensionConfiguration) => {
      editor.setIsLoading(true)

      const action = getIsDefaultContent(configuration) ? 'reset' : 'delete'

      try {
        await deleteContent({
          variables: {
            contentId: configuration.contentId,
            pageContext: iframeRuntime.route.pageContext,
            template: editor.blockData.template,
            treePath: editor.blockData.serverTreePath,
          },
        })

        // TODO
        // await updateIframeAndSiteEditor()

        editor.setIsLoading(false)

        showToast({
          horizontalPosition: 'right',
          message: intl.formatMessage({
            id: `admin/pages.editor.components.content.${action}.success`,
          }),
        })
      } catch (e) {
        editor.setIsLoading(false)

        showToast({
          horizontalPosition: 'right',
          message: intl.formatMessage({
            id: `admin/pages.editor.components.content.${action}.error`,
          }),
        })

        console.error(e)
      }
    },
    [deleteContent, editor, iframeRuntime.route.pageContext, intl, showToast]
  )

  const handleQuit = useCallback(
    (event?: Event) => {
      if (event) {
        event.stopPropagation()
      }

      onBack()
    },
    [onBack]
  )

  return {
    handleConfigurationDeletion,
    handleQuit,
  }
}
