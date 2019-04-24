import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import ActionMenu from '../../../ComponentList/SortableList/SortableListItem/ActionMenu'
import Tag from './Tag'
import { getTextFromContext } from './utils'

interface Props {
  configuration: ExtensionConfiguration
  isDisabled?: boolean
  isSitewide: boolean
  onClick: (configuration: ExtensionConfiguration) => void
  onDelete: () => void
  path: string
}

function stopPropagation(e: React.MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
}

const Card = ({
  configuration,
  isDisabled = false,
  intl,
  isSitewide,
  onClick,
  onDelete,
  path,
}: Props & ReactIntl.InjectedIntlProps) => {
  const actionMenuOptions = [
    {
      label: intl.formatMessage({
        id: 'admin/pages.editor.component-list.action-menu.delete',
      }),
      onClick: () => onDelete(),
    },
  ]

  return (
    <div
      className={`relative mh5 mt5 pa5 ba br3 b--light-gray hover-bg-light-silver ${
        !isDisabled ? 'pointer' : ''
      }`}
      onClick={() => {
        if (!isDisabled) {
          onClick(configuration)
        }
      }}
    >
      {configuration.label ? (
        <div>{configuration.label}</div>
      ) : (
        <FormattedMessage id="admin/pages.editor.components.configurations.defaultTitle">
          {text => <div className="i gray">{text}</div>}
        </FormattedMessage>
      )}
      <div className="mt5">
        <Tag
          bgColor={isDisabled ? 'transparent' : 'light-gray'}
          borderColor="mid-gray"
          hasBorder={isDisabled}
          text={getTextFromContext(
            intl,
            isSitewide,
            path,
            configuration.condition.pageContext
          )}
          textColor="mid-gray"
        />
      </div>
      <div className="absolute top-0 right-0 mt1" onClick={stopPropagation}>
        <ActionMenu options={actionMenuOptions} />
      </div>
    </div>
  )
}

export default injectIntl(Card)
