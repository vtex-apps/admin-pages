import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { CSSTransition } from 'react-transition-group'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { ANIMATION_TIMEOUT } from '../../consts'
import { useEditorContext } from '../../EditorContext'
import Modal from '../../Modal'
import SaveContentMutation from '../mutations/SaveContent'
import AbsoluteLoader from './AbsoluteLoader'
import BlockEditor from './BlockEditor'
import BlockSelector from './BlockSelector'
import useInitialEditingState from './hooks'
import { useModalContext } from './ModalContext'
import styles from './styles.css'
import Transitions from './Transitions'
import SendEventToAuditMutation from '../mutations/SendEventToAudit'

interface CustomProps {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
  updateHighlightTitleByTreePath: (
    titleByTreePath?: Record<string, { title?: string; isEditable: boolean }>
  ) => void
}

type Props = WithApolloClient<
  CustomProps & InjectedIntlProps & Pick<ToastConsumerFunctions, 'showToast'>
>

const Sidebar: React.FunctionComponent<Props> = ({
  client,
  highlightHandler,
  iframeRuntime,
  intl,
  showToast,
  updateHighlightTitleByTreePath,
}) => {
  const [scrollState, setScrollState] = React.useState('overflow-y-auto')
  const adminSidebar = React.createRef<HTMLElement>()
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
    getTextButtonAction,
    getTextButtonCancel,
    getTextMessage,
    getTitle,
    isActionDanger,
  } = useModalContext()

  const editor = useEditorContext()

  React.useEffect(() => {
    adminSidebar.current?.scroll(0, 0)

    if (editor.editTreePath && adminSidebar.current?.scrollTop === 0) {
      setScrollState('overflow-y-hidden vh-100')
    } else {
      setScrollState('overflow-x-auto')
    }
  }, [editor.editTreePath])

  return (
    <div
      id="sidebar-vtex-editor"
      className={'z-1 h-100 w-100 flex flex-row-reverse ' + scrollState}
    >
      <nav
        ref={adminSidebar}
        id="admin-sidebar"
        className={
          `transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns ` +
          `overflow-x-hidden w-100 font-display bg-white shadow-solid-x w-18em-ns ${styles['admin-sidebar']} ` +
          scrollState
        }
      >
        <div className="relative h-100 flex flex-column dark-gray overflow-y-auto">
          <Modal
            isActionDanger={isActionDanger}
            isActionLoading={editor.getIsLoading()}
            isOpen={getIsModalOpen()}
            onClickAction={handleModalAction}
            onClickCancel={handleModalCancel}
            onClose={handleModalClose}
            textButtonAction={getTextButtonAction()}
            textButtonCancel={getTextButtonCancel()}
            textMessage={getTextMessage()}
            title={getTitle()}
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
              timeout={ANIMATION_TIMEOUT}
            >
              <BlockSelector
                highlightHandler={highlightHandler}
                iframeRuntime={iframeRuntime}
                updateHighlightTitleByTreePath={updateHighlightTitleByTreePath}
              />
            </CSSTransition>

            <Transitions.Exit condition={!initialEditingState} to="right">
              <Transitions.Enter condition={!!initialEditingState} from="right">
                <SaveContentMutation>
                  {saveContent => (
                    <SendEventToAuditMutation>
                      {sendEventToAudit => (
                        <BlockEditor
                          iframeRuntime={iframeRuntime}
                          initialEditingState={initialEditingState}
                          saveContent={saveContent}
                          sendEventToAudit={sendEventToAudit}
                          showToast={showToast}
                        />
                      )}
                    </SendEventToAuditMutation>
                  )}
                </SaveContentMutation>
              </Transitions.Enter>
            </Transitions.Exit>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default injectIntl(withApollo(Sidebar))
