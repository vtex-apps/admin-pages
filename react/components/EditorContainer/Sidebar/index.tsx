import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { CSSTransition } from 'react-transition-group'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'
import Modal from '../../Modal'
import SaveContentMutation from '../mutations/SaveContent'

import AbsoluteLoader from './AbsoluteLoader'
import BlockEditor from './BlockEditor'
import BlockSelector from './BlockSelector'
import useInitialEditingState from './hooks'
import { useModalContext } from './ModalContext'
import styles from './styles.css'

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
  const initialEditingState = useInitialEditingState({
    client,
    iframeRuntime,
    intl,
    showToast,
  })

  const {
    actionHandler: handleModalAction,
    cancelHandler: handleModalCancel,
    close: handleModalClose,
    getIsOpen: getIsModalOpen,
  } = useModalContext()

  const editor = useEditorContext()

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
