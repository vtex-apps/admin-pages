import React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'

import Modal from '../../Modal'

import Content from './Content'
import { useFormMetaContext } from './FormMetaContext'
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
  const formMeta = useFormMetaContext()
  const modal = useModalContext()

  return (
    <div
      id="sidebar-vtex-editor"
      className={`z-1 h-100 top-3em-ns calc--height-ns w-18em-ns w-100 w-auto-ns ${
        visible ? 'flex' : 'dn'
      } flex-row-reverse overflow-x-auto`}
    >
      <nav
        id="admin-sidebar"
        className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
      >
        <div className="h-100 flex flex-column dark-gray">
          <Modal
            isActionLoading={formMeta.getIsLoading()}
            isOpen={modal.isOpen}
            onClickAction={modal.actionHandler}
            onClickCancel={modal.cancelHandler}
            onClose={modal.close}
            textButtonAction={intl.formatMessage(messages.save)}
            textButtonCancel={intl.formatMessage(messages.discard)}
            textMessage={intl.formatMessage(messages.unsaved)}
          />
          <Content
            highlightHandler={highlightHandler}
            iframeRuntime={runtime}
          />
        </div>
      </nav>
    </div>
  )
}

export default injectIntl(Sidebar)
