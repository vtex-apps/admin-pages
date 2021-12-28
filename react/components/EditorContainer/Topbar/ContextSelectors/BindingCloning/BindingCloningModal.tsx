import React, { FunctionComponent, useEffect, useRef } from 'react'
import {
  Button,
  Modal,
  ShowToastFunction,
  Spinner,
  ToastConsumer,
  EmptyState,
} from 'vtex.styleguide'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { pick } from 'ramda'

import BindingSelector, { BindingSelectorItem } from './BindingSelector'
import {
  CopyBindingVariables,
  SaveRouteVariables,
  useCloneContent,
} from './CloneContentContext'
import OverwriteDialog, { useOverwriteDialogState } from './OverwriteDialog'
import BetaAlert from './BetaAlert'

interface Props {
  isOpen?: boolean
  onClose: () => void
}

const saveRouteSanityCheck = (variables: SaveRouteVariables) => {
  const route = variables?.route

  if (
    !route ||
    // uuid shouldn't be defined, it will be generated on route creation,
    // otherwise it might replace an existing route
    route.uuid ||
    // dataSource needs to be 'vtex.rewriter', otherwise it will be
    // treated as a "colossus" route, which is not what we want here
    route.dataSource !== 'vtex.rewriter' ||
    !route.bindingId
  ) {
    return false
  }

  return true
}

const copyBindingsSanityCheck = (variables: CopyBindingVariables) => {
  if (
    !variables ||
    // If any of these values is empty, it might cause the
    // copyBindingContent mutation to be too broad, so we
    // are double checking them here to be a bit more safe
    !variables.from ||
    !variables.to ||
    !variables.template ||
    !variables.context ||
    !variables.context.type ||
    !variables.context.id
  ) {
    return false
  }

  return true
}

type SubmitStatus = 'IDLE' | 'SUBMITTING'

const toastMessages = defineMessages({
  saving: {
    id: 'admin/pages.editor.copy-page.modal.toast.saving',
  },
  success: {
    id: 'admin/pages.editor.copy-page.modal.toast.success',
  },
  error: {
    id: 'admin/pages.editor.copy-page.modal.toast.error',
  },
})

const BindingCloningModal: FunctionComponent<Props> = ({ isOpen, onClose }) => {
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>('IDLE')
  const intl = useIntl()

  const {
    showOverwriteDialog,
    isOverwriteDialogOpen,
    hideOverwriteDialog,
    onOverwriteCancel,
    onOverwriteConfirm,
  } = useOverwriteDialogState()

  const { data, actions } = useCloneContent()

  const {
    loading,
    error,
    routeInfo,
    bindingSelector,
    currentBinding,
    pageContext,
  } = data

  const {
    refetchRouteInfo,
    dispatchBindingSelector,
    saveRoute,
    copyBindings,
  } = actions

  const checkOverwrites = () => {
    return new Promise<void>((resolve, reject) => {
      const checkedItems = bindingSelector.filter(item => item.checked)
      const willOverwrite = checkedItems.some(item => item.overwrites)

      if (!willOverwrite) {
        resolve()
        return
      }

      showOverwriteDialog({
        onConfirm: resolve,
        onCancel: reject,
      })
    })
  }

  // Refetches and cleans up selection when the modal is
  // closed and reopened
  const wasOpen = useRef(true)
  useEffect(() => {
    if (!wasOpen.current && isOpen) {
      refetchRouteInfo()
      dispatchBindingSelector({ type: 'uncheck-all' })
      wasOpen.current = false
    }

    if (wasOpen.current && isOpen) {
      wasOpen.current = false
    }
  }, [wasOpen, isOpen, refetchRouteInfo, dispatchBindingSelector])

  const saveItem = async (item: BindingSelectorItem) => {
    if (!routeInfo) return

    const copyBindingsVariables = {
      from: currentBinding.id,
      to: item.id,
      template: routeInfo.blockId,
      context: pageContext,
    }

    if (!copyBindingsSanityCheck(copyBindingsVariables)) {
      throw new Error()
    }

    try {
      if (!item.overwrites) {
        const saveRouteVariables = {
          route: {
            ...pick(
              [
                'auth',
                'blockId',
                'context',
                'declarer',
                'domain',
                'interfaceId',
                'path',
                'routeId',
                'pages',
                'title',
                'metaTags',
              ],
              routeInfo
            ),
            dataSource: 'vtex.rewriter',
            bindingId: item.id,
          },
        }

        if (!saveRouteSanityCheck(saveRouteVariables)) {
          throw new Error()
        }

        const { error: errorSavingRoute } = await saveRoute({
          variables: saveRouteVariables,
        })
        if (errorSavingRoute) {
          throw new Error()
        }
      }
      const { error: errorCopyingBindings } = await copyBindings({
        variables: copyBindingsVariables,
      })
      if (errorCopyingBindings) {
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const applyChanges = async () => {
    const checkedItems = bindingSelector.filter(item => item.checked)
    for (const item of checkedItems) {
      try {
        await saveItem(item)
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }

  const handleClose = () => {
    setSubmitStatus('IDLE')
    onClose()
  }

  const handleConfirmCopyContent = async ({
    showToast,
  }: {
    showToast: ShowToastFunction
  }) => {
    if (submitStatus === 'SUBMITTING') {
      return
    }

    setSubmitStatus('SUBMITTING')

    try {
      // It doesn't throw an error. User just refused to overwrite
      await checkOverwrites()

      showToast({
        message: intl.formatMessage(toastMessages.saving),
        duration: Infinity,
      })
      try {
        await applyChanges()
        setTimeout(() => {
          showToast(intl.formatMessage(toastMessages.success))
        }, 500)
      } catch {
        // There is a bug with the Toast component, where
        // if you call two toasts on rapid succession,
        // the second one will be ignored. This timeout
        // gets around this issue, which happens if the error
        // is immediate
        setTimeout(() => {
          showToast(intl.formatMessage(toastMessages.error))
        }, 500)
      }
    } finally {
      handleClose()
    }
  }

  return (
    <>
      <ToastConsumer>
        {({ showToast }) => (
          <Modal
            isOpen={isOpen}
            onClose={handleClose}
            bottomBar={
              <div className="flex justify-end">
                <span className="mr4">
                  <Button onClick={handleClose} variation="secondary">
                    <FormattedMessage id="admin/pages.editor.components.button.cancel" />
                  </Button>
                </span>
                <Button
                  disabled={submitStatus === 'SUBMITTING'}
                  onClick={() => handleConfirmCopyContent({ showToast })}
                >
                  <FormattedMessage id="admin/pages.editor.components.button.save" />
                </Button>
              </div>
            }
          >
            <div className="mb6">
              <h3>
                <FormattedMessage id="admin/pages.editor.copy-page.modal.header" />
              </h3>
              <BetaAlert />
              {loading ? (
                <div className="tc min-h-large-l">
                  <Spinner color="currentColor" />
                </div>
              ) : error || !routeInfo ? (
                <EmptyState
                  title={
                    <FormattedMessage id="admin/pages.editor.copy-page.modal.error.title" />
                  }
                >
                  <p>
                    <FormattedMessage id="admin/pages.editor.copy-page.modal.error.body" />
                  </p>
                </EmptyState>
              ) : (
                <>
                  <div className="f5 mb5">
                    <FormattedMessage id="admin/pages.editor.copy-page.modal.subheader" />
                  </div>
                  <BindingSelector
                    reducer={[bindingSelector, dispatchBindingSelector]}
                    pathId={routeInfo.path}
                  />
                </>
              )}
            </div>
          </Modal>
        )}
      </ToastConsumer>
      <OverwriteDialog
        state={bindingSelector}
        pathId={routeInfo?.path ?? ''}
        isOpen={isOverwriteDialogOpen}
        onClose={hideOverwriteDialog}
        onConfirm={onOverwriteConfirm}
        onCancel={onOverwriteCancel}
      />
    </>
  )
}

export default BindingCloningModal
