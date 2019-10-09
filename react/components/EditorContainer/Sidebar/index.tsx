import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import Modal from '../../Modal'
import SaveContentMutation from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import BlockEditor from './BlockEditor'
import BlockSelector from './BlockSelector'
import { useModalContext } from './ModalContext'
import { EditingState } from './typings'
import {
  getInitialEditingState,
  getIsSitewide,
  updateEditorBlockData,
} from './utils'

interface Props extends InjectedIntlProps {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
  visible: boolean
}

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
  highlightHandler,
  iframeRuntime,
  intl,
  visible,
}) => {
  const [initialEditingState, setInitialEditingState] = React.useState<
    EditingState
  >()

  const editor = useEditorContext()

  React.useEffect(() => {
    if (editor.editTreePath === null && initialEditingState) {
      setInitialEditingState(undefined)
    }
  }, [editor.editTreePath, initialEditingState])

  const {
    actionHandler: handleModalAction,
    cancelHandler: handleModalCancel,
    close: handleModalClose,
    getIsOpen: getIsModalOpen,
  } = useModalContext()

  const treePath = editor.editTreePath || ''

  const isSitewide = getIsSitewide(iframeRuntime.extensions, treePath)

  const blockId =
    iframeRuntime.extensions[treePath] &&
    iframeRuntime.extensions[treePath].blockId

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const serverTreePath = isSitewide ? getSitewideTreePath(treePath) : treePath

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

          {editor.editTreePath === null ? (
            <BlockSelector
              highlightHandler={highlightHandler}
              iframeRuntime={iframeRuntime}
            />
          ) : (
            <ToastConsumer>
              {({ showToast }) => (
                <SaveContentMutation>
                  {saveContent => (
                    <ListContentQuery
                      onCompleted={data => {
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

                          editor.setIsLoading(false)
                      }}
                      variables={{
                        blockId,
                        pageContext: iframeRuntime.route.pageContext,
                        template,
                        treePath: serverTreePath,
                      }}
                    >
                        {() => (
                        <BlockEditor
                          iframeRuntime={iframeRuntime}
                                initialEditingState={initialEditingState}
                          saveContent={saveContent}
                          showToast={showToast}
                        />
                      )}
                    </ListContentQuery>
                  )}
                </SaveContentMutation>
              )}
            </ToastConsumer>
          )}
        </div>
      </nav>
    </div>
  )
}

export default injectIntl(Sidebar)
