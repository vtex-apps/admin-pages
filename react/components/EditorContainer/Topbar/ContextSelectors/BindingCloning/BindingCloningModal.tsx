import React, { FunctionComponent, useEffect, useRef } from 'react'
import { Button, Modal, Spinner, ToastConsumer } from 'vtex.styleguide'
import { pick } from 'ramda'

import BindingSelector, { BindingSelectorItem } from './BindingSelector'
import { useCloneContent } from './CloneContentContext'
import OverwriteDialog, { useOverwriteDialogState } from './OverwriteDialog'
import BetaAlert from './BetaAlert'

interface Props {
  isOpen?: boolean
  onClose: () => void
}

const saveRouteSanityCheck = (variables: any) => {
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

const copyBindingsSanityCheck = (variables: any) => {
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

const BindingCloningModal: FunctionComponent<Props> = ({ isOpen, onClose }) => {
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

  const saveItem = (item: BindingSelectorItem) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise<void>(async (resolve, reject) => {
      // TODO: better handling !routeInfo
      if (!routeInfo) return
      if (!item.overwrites) {
        try {
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

          const copyBindingsVariables = {
            from: currentBinding.id,
            to: item.id,
            template: routeInfo?.blockId,
            context: pageContext,
          }

          if (
            !saveRouteSanityCheck(saveRouteVariables) ||
            !copyBindingsSanityCheck(copyBindingsVariables)
          ) {
            reject()
            return
          }

          await saveRoute({
            variables: saveRouteVariables,
          })

          await copyBindings({
            variables: copyBindingsVariables,
          })

          // TODO: check result of mutations for success or error
          resolve()
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
          reject(error)
        }
      } else {
        try {
          const copyBindingsVariables = {
            from: currentBinding.id,
            to: item.id,
            template: routeInfo?.blockId,
            context: pageContext,
          }

          if (!copyBindingsSanityCheck(copyBindingsVariables)) {
            reject()
            return
          }

          await copyBindings({
            variables: copyBindingsVariables,
          })
          // TODO: check result of mutation for success or error
          resolve()
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
          reject(error)
        }
      }
    })

  const applyChanges = async () => {
    const checkedItems = bindingSelector.filter(item => item.checked)
    for (const item of checkedItems) {
      try {
        await saveItem(item)
      } catch (error) {
        // TODO: better error handling
        return Promise.reject()
      }
    }

    return Promise.resolve()
  }

  return (
    <>
      <ToastConsumer>
        {({ showToast }) => (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            bottomBar={
              <div className="flex justify-end">
                <span className="mr4">
                  {/* TODO: i18n */}
                  <Button onClick={() => onClose()} variation="secondary">
                    Cancel
                  </Button>
                </span>
                <Button
                  onClick={() => {
                    checkOverwrites()
                      .then(() => {
                        // TODO: i18n. also better messages
                        showToast({ message: 'Saving...', duration: Infinity })
                        applyChanges()
                          .then(() => {
                            // See comment below on the catch block
                            setTimeout(() => {
                              showToast('Done!')
                            }, 500)
                          })
                          .catch(() => {
                            // There is a bug with the Toast component, where
                            // if you call two toasts on rapid succession,
                            // the second one will be ignored. This timeout
                            // gets around this issue, which happens if the error
                            // is immediate
                            setTimeout(() => {
                              showToast(
                                'An error has occourred. Please try again'
                              )
                            }, 500)
                          })
                        onClose()
                      })
                      .catch(() => {
                        //  not an error, the user has just refused to overwrite
                      })
                  }}
                >
                  Confirm
                </Button>
                {/* TODO: i18n */}
              </div>
            }
          >
            <div className="mb6">
              <h3>Clone page to other bindings</h3>
              <BetaAlert />
              {loading ? (
                <div className="tc min-h-large-l">
                  <Spinner color="currentColor" />
                </div>
              ) : error ? (
                <div>Error: {JSON.stringify(error)}</div>
              ) : (
                <>
                  <div className="f5 mb5">
                    Please choose to which bindings the content will be
                    duplicated. If the page doesn&apos;t exist in a binding, it
                    will be created and metadata (such as SEO information) will
                    also be copied.
                  </div>
                  <BindingSelector
                    reducer={[bindingSelector, dispatchBindingSelector]}
                    // TODO: better handling when !routeInfo
                    pathId={routeInfo?.path ?? ''}
                  />
                </>
              )}
            </div>
          </Modal>
        )}
      </ToastConsumer>
      <OverwriteDialog
        state={bindingSelector}
        // TODO: better handling when !routeInfo
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
