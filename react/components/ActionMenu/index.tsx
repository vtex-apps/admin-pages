import React from 'react'
import {
  ActionMenu as StyleguideActionMenu,
  IconOptionsDots,
} from 'vtex.styleguide'

import { ActionMenuOption } from './typings'

interface Props {
  buttonSize?: string
  disabled?: boolean
  menuWidth?: number | string
  options: ActionMenuOption[]
  variation?: string
}

const icon = <IconOptionsDots color="currentColor" />

const ActionMenu: React.FunctionComponent<Props> = ({
  buttonSize,
  disabled = false,
  menuWidth,
  options,
  variation = 'tertiary',
}) => (
  <StyleguideActionMenu
    buttonProps={{
      disabled,
      icon,
      size: buttonSize,
      type: 'button',
      variation,
    }}
    hideCaretIcon
    menuWidth={menuWidth}
    options={options}
  />
)

export default ActionMenu
