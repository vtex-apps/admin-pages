import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'

import ContentActiveIcon from '../../../../../icons/ContentActiveIcon'
import ContentInactiveIcon from '../../../../../icons/ContentInactiveIcon'
import ContentScheduledIcon from '../../../../../icons/ContentScheduledIcon'

interface Props {
  type: 'active' | 'inactive' | 'scheduled'
}

const messages = defineMessages({
  active: {
    defaultMessage: 'Active',
    id: 'admin/pages.editor.component-list.status.active',
  },
  inactive: {
    defaultMessage: 'Inactive',
    id: 'admin/pages.editor.component-list.status.inactive',
  },
  scheduled: {
    defaultMessage: 'Scheduled',
    id: 'admin/pages.editor.component-list.status.scheduled',
  },
})

const ICON_BY_STATUS = {
  active: <ContentActiveIcon />,
  inactive: <ContentInactiveIcon />,
  scheduled: <ContentScheduledIcon />,
}

const StatusLabel: React.FC<Props & InjectedIntlProps> = ({ intl, type }) => (
  <div className="flex items-center mb3">
    {ICON_BY_STATUS[type]}

    <div className="ml2 ttu f7 fw7">{intl.formatMessage(messages[type])}</div>
  </div>
)

export default injectIntl(StatusLabel)
