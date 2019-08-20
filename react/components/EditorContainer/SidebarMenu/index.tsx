import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import { useEditorContext } from '../../EditorContext'
import styles from './styles.css'

interface Props extends InjectedIntlProps {
  runtime: RenderContext
  visible: boolean
}

const SidebarMenu: React.FunctionComponent<Props> = ({
  intl,
  runtime,
  visible,
}) => {
  // const editor = useEditorContext()
  // const {
  //   actionHandler: handleModalAction,
  //   cancelHandler: handleModalCancel,
  //   close: handleModalClose,
  //   isOpen: isModalOpen,
  // } = useModalContext()

  // const isLoading = editor.getIsLoading()

  return (
    <div
      className={
        visible
          ? `z-1 h-100 top-3em-ns w-100 w-auto-ns flex flex-row-reverse overflow-x-auto ${
              styles.container
            }`
          : 'dn'
      }
    >
      <nav className="transition animated fadeIn b--light-silver bl z-2 h-100 pt8 pt0-ns overflow-x-hidden w-100 font-display bg-white shadow-solid-x">
        <div className="mv5 mb7 tc c-muted-1 f7">
          <span
            className="mb3 center"
            style={{
              width: '25px',
              height: '25px',
              display: 'block',
              display: 'block',
              outline: '1px solid blue',
            }}
          />
          Content
        </div>
        <div className="mv7 tc c-muted-1 f7">
          <span
            className="mb3 center"
            style={{
              width: '25px',
              height: '25px',
              display: 'block',
              display: 'block',
              outline: '1px solid blue',
            }}
          />
          Editor
        </div>
        <div className="mv7 tc c-muted-1 f7">
          <span
            className="mb3 center"
            style={{
              width: '25px',
              height: '25px',
              display: 'block',
              display: 'block',
              outline: '1px solid blue',
            }}
          />
          Pages
        </div>
        <div className="mv7 tc c-muted-1 f7">
          <span
            className="mb3 center"
            style={{
              width: '25px',
              height: '25px',
              display: 'block',
              display: 'block',
              outline: '1px solid blue',
            }}
          />
          Settings
        </div>
      </nav>
    </div>
  )
}

export default injectIntl(SidebarMenu)
