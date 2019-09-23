import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'
import Modal from '../../Modal'
import DeleteContentMutation from '../mutations/DeleteContent'
import SaveContentMutation from '../mutations/SaveContent'

import BlockEditor from './BlockEditor'
import BlockSelector from './BlockSelector'
import { useModalContext } from './ModalContext'

interface Props extends InjectedIntlProps {
  highlightHandler: (treePath: string | null) => void
  runtime: RenderContext
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
  intl,
  runtime,
  visible,
}) => {
  const editor = useEditorContext()

  const {
    actionHandler: handleModalAction,
    cancelHandler: handleModalCancel,
    close: handleModalClose,
    getIsOpen: getIsModalOpen,
  } = useModalContext()

  const isLoading = editor.getIsLoading()

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
        <div className="h-100 flex flex-column dark-gray">
          <Modal
            isActionLoading={isLoading}
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
              iframeRuntime={runtime}
            />
          ) : (
            <ToastConsumer>
              {({ showToast }) => (
                <SaveContentMutation>
                  {saveContent => (
                    <DeleteContentMutation>
                      {deleteContent => (
                        <BlockEditor
                          deleteContent={deleteContent}
                          iframeRuntime={runtime}
                          saveContent={saveContent}
                          showToast={showToast}
                        />
                      )}
                    </DeleteContentMutation>
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
