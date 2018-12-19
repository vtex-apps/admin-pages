import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, Card } from 'vtex.styleguide'
import Delete from '../../icons/Delete'

interface Props {
  activeConfiguration?: AdaptedExtensionConfiguration
  configuration: AdaptedExtensionConfiguration
  isDisabled?: boolean
  onClick: (configuration: ExtensionConfiguration) => void
  onDelete: (configurationId: ExtensionConfiguration['configurationId']) => void
  onEdit: (configuration: ExtensionConfiguration) => void
}

const ConfigurationCard = ({
  activeConfiguration,
  configuration,
  isDisabled = false,
  intl,
  onClick,
  onEdit,
  onDelete,
}: Props & ReactIntl.InjectedIntlProps) => {
  const isActive =
    activeConfiguration &&
    configuration.configurationId === activeConfiguration.configurationId

  return (
    <div
      className={`mh5 mt5 ${!isDisabled ? 'pointer' : ''}`}
      onClick={() => {
        if (!isDisabled) {
          onClick(configuration)
        }
      }}
    >
      <Card noPadding>
        <div
          className={`pa5 ${
            isActive
              ? 'bg-washed-blue'
              : isDisabled
                ? 'gray bg-light-silver'
                : ''
          }`}
        >
        <div className="flex justify-between items-center">
          {configuration.label ? (
            <div className="f4">{configuration.label}</div>
          ) : (
            <FormattedMessage id="pages.editor.components.configurations.defaultTitle">
              {text => <div className="f4 i gray">{text}</div>}
            </FormattedMessage>
          )}
          <Button
            icon
            onClick={() => {
              onDelete(configuration.configurationId)
            }}
            size="small"
            variation="tertiary"
          >
            <Delete/>
          </Button>
            </div>
          {!isDisabled && (
            <div className="mt5">
              <FormattedMessage id="pages.conditions.scope.title" />
              <Badge bgColor="#979899" color="#FFF">
                {intl.formatMessage({
                  id: `pages.conditions.scope.${configuration.scope}`,
                })}
              </Badge>
            </div>
          )}
          {configuration.conditions.length > 0 && (
            <div className="mt5">
              <FormattedMessage id="pages.editor.components.configurations.customConditions" />
              <div>{configuration.conditions.join(', ')}</div>
            </div>
          )}
          {!isDisabled && (
            <div className="mt5">
              <Button
                onClick={() => {
                  onEdit(configuration)
                }}
                size="small"
                variation="tertiary"
              >
                {intl.formatMessage({
                  id: 'pages.editor.components.configurations.button.edit',
                })}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default injectIntl(ConfigurationCard)
