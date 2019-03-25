import React from 'react'
import {
  ActionMenu as StyleguideActionMenu,
  IconOptionsDots,
} from 'vtex.styleguide'

import { ActionMenuOption } from './typings'

interface Props {
  options: ActionMenuOption[]
}

const ActionMenu: React.FunctionComponent<Props> = ({ options }) => (
  <StyleguideActionMenu
    buttonProps={{
      icon: <IconOptionsDots />,
      variation: 'tertiary',
    }}
    hideCaretIcon
    options={options}
  />
)

export default ActionMenu
