import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

// import { useEditorContext } from '../../EditorContext'
import BlocksIcon from '../../icon/Blocks'
import PagesIcon from '../../icon/Pages'
import SettingsIcon from '../../icon/Settings'
import GalleryIcon from '../../icon/Gallery'
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
        <div className="mt2 pv5 tc c-emphasis pointer f7">
          <span className="mb1 center db">
            <BlocksIcon />
          </span>
          Blocks
        </div>
        <div className="pv5 tc c-muted-1 hover-c-action-primary pointer f7">
          <span className="mb1 center db">
            <PagesIcon />
          </span>
          Pages
        </div>
        <div className="pv5 tc c-muted-1 hover-c-action-primary pointer f7">
          <span className="mb1 center db">
            <SettingsIcon />
          </span>
          Settings
        </div>
        <div className="pv5 tc c-muted-1 hover-c-action-primary pointer f7">
          <span className="mb1 center db">
            <GalleryIcon />
          </span>
          Gallery
        </div>
      </nav>
    </div>
  )
}

export default injectIntl(SidebarMenu)
