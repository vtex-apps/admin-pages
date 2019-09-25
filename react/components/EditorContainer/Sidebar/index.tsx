import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import Modal from '../../Modal'
import SaveContentMutation from '../mutations/SaveContent'

import BlockEditor from './BlockEditor'
import BlockSelector from './BlockSelector'
import { useModalContext } from './ModalContext'
import ListContentQuery from '../queries/ListContent'
import { getIsSitewide } from './BlockEditor/utils'

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
  const editor = useEditorContext()

  const {
    actionHandler: handleModalAction,
    cancelHandler: handleModalCancel,
    close: handleModalClose,
    getIsOpen: getIsModalOpen,
  } = useModalContext()

  const isLoading = editor.getIsLoading()

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
              iframeRuntime={iframeRuntime}
            />
          ) : (
            <ToastConsumer>
              {({ showToast }) => (
                <SaveContentMutation>
                  {saveContent => (
                    <ListContentQuery
                      variables={{
                        blockId,
                        pageContext: iframeRuntime.route.pageContext,
                        template,
                        treePath: serverTreePath,
                      }}
                    >
                      {query => (
                        <BlockEditor
                          iframeRuntime={iframeRuntime}
                          isSitewide={isSitewide}
                          query={query}
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
