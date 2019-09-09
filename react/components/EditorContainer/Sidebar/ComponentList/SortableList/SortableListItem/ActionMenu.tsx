import React from 'react'
import {
  ActionMenu as StyleguideActionMenu,
  IconOptionsDots,
} from 'vtex.styleguide'

import { ActionMenuOption } from './typings'

interface Props {
  buttonSize?: string
  menuWidth?: number | string
  options: ActionMenuOption[]
  variation?: string
}

const icon = <IconOptionsDots color="currentColor" />

const ActionMenu: React.FunctionComponent<Props> = ({
  buttonSize,
  menuWidth,
  options,
  variation,
}) => (
  <StyleguideActionMenu
    buttonProps={{
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

ActionMenu.defaultProps = {
  variation: 'tertiary',
}

export default ActionMenu
