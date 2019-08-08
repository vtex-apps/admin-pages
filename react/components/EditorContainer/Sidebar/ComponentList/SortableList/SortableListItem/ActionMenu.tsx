import React from 'react'
import {
  ActionMenu as StyleguideActionMenu,
  IconOptionsDots,
} from 'vtex.styleguide'

import { ActionMenuOption } from './typings'

interface Props {
  options: ActionMenuOption[]
  menuWidth?: number | string
}

const ActionMenu: React.FunctionComponent<Props> = ({ menuWidth, options }) => (
  <StyleguideActionMenu
    buttonProps={{
      icon: <IconOptionsDots />,
      type: 'button',
      variation: 'tertiary',
    }}
    hideCaretIcon
    menuWidth={menuWidth}
    options={options}
  />
)

export default ActionMenu
