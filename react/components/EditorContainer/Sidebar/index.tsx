import React from 'react'
import { injectIntl } from 'react-intl'

import Modal from '../../Modal'

import Content from './Content'
import { FormMetaConsumer } from './FormMetaContext'
import { ModalConsumer } from './ModalContext'

interface CustomProps {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  runtime: RenderContext
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const Sidebar: React.SFC<Props> = ({
  editor,
  highlightHandler,
  intl,
  runtime,
}) => (
  <div
    id="sidebar-vtex-editor"
    className="z-1 h-100 top-3em-ns calc--height-ns w-18em-ns w-100 w-auto-ns flex flex-row-reverse overflow-x-auto"
  >
    <FormMetaConsumer>
      {formMeta => (
        <ModalConsumer>
          {modal => (
            <nav
              id="admin-sidebar"
              className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
            >
              <div className="h-100 flex flex-column dark-gray">
                <Modal
                  isActionLoading={formMeta.isLoading}
                  isOpen={modal.isOpen}
                  onClickAction={modal.actionHandler}
                  onClickCancel={modal.cancelHandler}
                  onClose={modal.close}
                  textButtonAction={intl.formatMessage({
                    id: 'pages.editor.components.button.save',
                  })}
                  textButtonCancel={intl.formatMessage({
                    id: 'pages.editor.components.modal.button.discard',
                  })}
                  textMessage={intl.formatMessage({
                    id: 'pages.editor.components.modal.text',
                  })}
                />
                <Content
                  editor={editor}
                  highlightHandler={highlightHandler}
                  iframeRuntime={runtime}
                />
              </div>
            </nav>
          )}
        </ModalConsumer>
      )}
    </FormMetaConsumer>
  </div>
)

export default injectIntl(Sidebar)
