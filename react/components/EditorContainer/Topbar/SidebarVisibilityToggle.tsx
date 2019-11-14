import { createKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Tooltip } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'

import { useHover } from './hooks'
import IconView from './icons/IconView'

const SidebarVisibilityToggle: React.FC<InjectedIntlProps> = ({ intl }) => {
  const editor = useEditorContext()

  const { handleMouseEnter, handleMouseLeave, hover } = useHover()

  const handleSidebarVisibilityToggle = editor.toggleSidebarVisibility

  const handleSidebarVisibilityToggleKeyDown = createKeydownFromClick(
    handleSidebarVisibilityToggle
  )

  return (
    <Tooltip
      label={intl.formatMessage({
        defaultMessage: 'Preview',
        id: 'admin/pages.editor.topbar.button.preview.tooltip',
      })}
      position="bottom"
    >
      <button
        className={`w2 h2 bg-white br2 b--transparent outline-0 pointer flex justify-center items-center ${
          editor.isSidebarVisible && !hover
            ? 'c-on-disabled'
            : 'c-action-primary'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleSidebarVisibilityToggle}
        onKeyDown={handleSidebarVisibilityToggleKeyDown}
      >
        <IconView />
      </button>
    </Tooltip>
  )
}

export default injectIntl(SidebarVisibilityToggle)
