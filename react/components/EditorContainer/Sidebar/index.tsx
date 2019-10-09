import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { CSSTransition } from 'react-transition-group'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import Modal from '../../Modal'
import ListContent from '../graphql/ListContent.graphql'
import SaveContentMutation from '../mutations/SaveContent'
import { ListContentData, ListContentVariables } from '../queries/ListContent'

import AbsoluteLoader from './AbsoluteLoader'
import BlockEditor from './BlockEditor'
import BlockSelector from './BlockSelector'
import { useModalContext } from './ModalContext'
import styles from './styles.css'
import { EditingState } from './typings'
import {
  getInitialEditingState,
  getIsSitewide,
  updateEditorBlockData,
} from './utils'

interface CustomProps {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
  visible: boolean
}

type Props = WithApolloClient<
  CustomProps & InjectedIntlProps & Pick<ToastConsumerFunctions, 'showToast'>
>

const messages = defineMessages({
  discard: {
    defaultMessage: 'Discard',
    id: 'admin/pages.editor.components.modal.button.discard',
  },
  save: {
    defaultMessage: 'Save',
    id: 'admin/pages.editor.components.button.save',
  },
  unsaved: {
    defaultMessage: 'You have unsaved modifications.',
    id: 'admin/pages.editor.components.modal.text',
  },
})

const Sidebar: React.FunctionComponent<Props> = ({
  client,
  highlightHandler,
  iframeRuntime,
  intl,
  showToast,
  visible,
}) => {
  const [initialEditingState, setInitialEditingState] = React.useState<
    EditingState
  >()

  const editor = useEditorContext()

  const isEditing = editor.editTreePath !== null

  const treePath = editor.editTreePath || ''

  const isSitewide = getIsSitewide(iframeRuntime.extensions, treePath)

  const blockId =
    iframeRuntime.extensions[treePath] &&
    iframeRuntime.extensions[treePath].blockId

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const serverTreePath = isSitewide ? getSitewideTreePath(treePath) : treePath

  const fetchAndSetData = React.useCallback(async () => {
    try {
      const { data } = await client.query<
        ListContentData,
        ListContentVariables
      >({
        fetchPolicy: 'network-only',
        query: ListContent,
        variables: {
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

  React.useEffect(() => {
    if (isEditing && !initialEditingState) {
      fetchAndSetData()
    }
  }, [isEditing, fetchAndSetData, initialEditingState])

  React.useEffect(() => {
    if (!isEditing && initialEditingState) {
      setInitialEditingState(undefined)
    }
  }, [isEditing, initialEditingState])

  const {
    actionHandler: handleModalAction,
    cancelHandler: handleModalCancel,
    close: handleModalClose,
    getIsOpen: getIsModalOpen,
  } = useModalContext()

  return (
    <div
      id="sidebar-vtex-editor"
      className={
        visible
          ? 'z-1 h-100 top-3em-ns w-18em-ns w-100 w-auto-ns flex flex-row-reverse overflow-x-auto'
          : 'dn'
      }
    >
      <nav
        id="admin-sidebar"
        className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns overflow-x-hidden w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
      >
        <div className="relative h-100 flex flex-column dark-gray">
          <Modal
            isActionLoading={editor.getIsLoading()}
            isOpen={getIsModalOpen()}
            onClickAction={handleModalAction}
            onClickCancel={handleModalCancel}
            onClose={handleModalClose}
            textButtonAction={intl.formatMessage(messages.save)}
            textButtonCancel={intl.formatMessage(messages.discard)}
            textMessage={intl.formatMessage(messages.unsaved)}
          />

          <div className="flex">
            <AbsoluteLoader
              containerClassName={`w-100 h-100 absolute top-0 ${
                !editor.getIsLoading() ? 'dn' : ''
              }`}
            />

            <CSSTransition
              classNames={{
                enter: styles['transition-selector-enter'],
                enterActive: styles['transition-selector-enter-active'],
                enterDone: styles['transition-selector-enter-done'],
                exit: styles['transition-selector-exit'],
                exitActive: styles['transition-selector-exit-active'],
                exitDone: styles['transition-selector-exit-done'],
              }}
              in={!!initialEditingState}
              timeout={250}
            >
              <BlockSelector
                highlightHandler={highlightHandler}
                iframeRuntime={iframeRuntime}
              />
            </CSSTransition>

            <CSSTransition
              appear
              classNames={{
                appear: styles['transition-editor-enter'],
                appearActive: styles['transition-editor-enter-active'],
                appearDone: styles['transition-editor-enter-done'],
                enter: styles['transition-editor-enter'],
                enterActive: styles['transition-editor-enter-active'],
                enterDone: styles['transition-editor-enter-done'],
                exit: styles['transition-editor-exit'],
                exitActive: styles['transition-editor-exit-active'],
                exitDone: styles['transition-editor-exit-done'],
              }}
              mountOnEnter
              in={!!initialEditingState}
              timeout={250}
              unmountOnExit
            >
              <SaveContentMutation>
                {saveContent => (
                  <BlockEditor
                    iframeRuntime={iframeRuntime}
                    initialEditingState={initialEditingState}
                    saveContent={saveContent}
                    showToast={showToast}
                  />
                )}
              </SaveContentMutation>
            </CSSTransition>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default injectIntl(withApollo(Sidebar))
