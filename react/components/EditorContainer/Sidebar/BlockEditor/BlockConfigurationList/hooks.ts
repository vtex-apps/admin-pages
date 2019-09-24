import { useCallback } from 'react'

import { useEditorContext } from '../../../../EditorContext'
import { getIsDefaultContent } from '../utils'

import { UseListHandlers } from './typings'
import { getDefaultConfiguration } from './utils'

export const useListHandlers: UseListHandlers = ({
  deleteContent,
  iframeRuntime,
  intl,
  isSitewide,
  serverTreePath,
  showToast,
  template,
}) => {
  const editor = useEditorContext()

  // TODO
  const handleConfigurationOpen = useCallback(
    (configuration: ExtensionConfiguration) => {
      return
    },
    []
  )
  // = useCallback(
  //   async (configuration: ExtensionConfiguration) => {
  //     TODO: set formData

  //     const baseContent =
  //       newConfiguration.contentId !== NEW_CONFIGURATION_ID
  //         ? (JSON.parse(newConfiguration.contentJSON) as Extension['content'])
  //         : {}

  //     const formData = getFormData(baseContent)

  //     await iframeRuntime.updateExtension(editor.editTreePath, {
  //       ...iframeRuntime.extensions[editor.editTreePath],
  //       content: formData,
  //     })

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
  //   },
  //   []
  // )

  const handleConfigurationCreation = useCallback(() => {
    handleConfigurationOpen(
      getDefaultConfiguration({ iframeRuntime, isSitewide })
    )
  }, [handleConfigurationOpen, iframeRuntime, isSitewide])

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
            template,
            treePath: serverTreePath,
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
    [
      deleteContent,
      editor,
      iframeRuntime.route.pageContext,
      intl,
      serverTreePath,
      showToast,
      template,
    ]
  )

  const handleQuit = useCallback(
    (event?: Event) => {
      if (event) {
        event.stopPropagation()
      }

      editor.editExtensionPoint(null)
    },
    [editor]
  )

  return {
    handleConfigurationCreation,
    handleConfigurationDeletion,
    handleConfigurationOpen,
    handleQuit,
  }
}
