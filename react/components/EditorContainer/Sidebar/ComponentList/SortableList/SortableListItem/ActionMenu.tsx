import React from 'react'
import {
  ActionMenu as StyleguideActionMenu,
  IconOptionsDots,
} from 'vtex.styleguide'

import { ActionMenuOption } from './typings'

interface Props {
  options: ActionMenuOption[]
}

const ActionMenu: React.SFC<Props> = ({ options }) => (
  <StyleguideActionMenu
    buttonProps={{
      icon: true,
      variation: 'tertiary',
    }}
    hideCaretIcon
    icon={<IconOptionsDots />}
    options={options}
  />
)

export default ActionMenu
