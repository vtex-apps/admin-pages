import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import Tag from './Tag'

interface Props {
  configuration: AdaptedExtensionConfiguration
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
    className="mh5 mt5 pointer"
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
          text={intl.formatMessage({
            id: `pages.conditions.scope.${configuration.scope}`,
          })}
          textColor="mid-gray"
        />
      </div>
      {configuration.conditions.length > 0 && (
        <div className="mt5">
          <FormattedMessage id="pages.editor.components.configurations.customConditions" />
          <div>{configuration.conditions.join(', ')}</div>
        </div>
      )}
    </div>
  </div>
)

export default injectIntl(Card)
