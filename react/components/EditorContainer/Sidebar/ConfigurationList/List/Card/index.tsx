import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import Tag from './Tag'

interface Props {
  configuration: ExtensionConfiguration
  isDisabled?: boolean
  onClick: (configuration: ExtensionConfiguration) => void
}

const Card = ({
  configuration,
  isDisabled = false,
  intl,
  onClick,
}: Props & ReactIntl.InjectedIntlProps) => (
  <div
    className={`mh5 mt5 ${!isDisabled ? 'pointer' : ''}`}
    onClick={() => {
      if (!isDisabled) {
        onClick(configuration)
      }
    }}
  >
    <div className="pa5 ba br3 b--light-gray hover-bg-light-silver">
      {configuration.label ? (
        <div>{configuration.label}</div>
      ) : (
        <FormattedMessage id="pages.editor.components.configurations.defaultTitle">
          {text => <div className="i gray">{text}</div>}
        </FormattedMessage>
      )}
      <div className="mt5">
        <Tag
          bgColor={isDisabled ? 'transparent' : 'light-gray'}
          borderColor="mid-gray"
          hasBorder={isDisabled}
          // TODO
          // text={intl.formatMessage({
          //   id: `pages.conditions.scope.${
          //     configuration.condition.context.type === 'route' ? 'route' : 'entity'
          //   }`,
          // })}
          text="test"
          textColor="mid-gray"
        />
      </div>
    </div>
  </div>
)

export default injectIntl(Card)
