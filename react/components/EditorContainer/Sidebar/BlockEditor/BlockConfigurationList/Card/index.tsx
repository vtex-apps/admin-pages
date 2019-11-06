import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import ActionMenu from '../../../../../ActionMenu'
import { useEditorContext } from '../../../../../EditorContext'
import EarthIcon from '../../../../../icons/EarthIcon'
import TemplateIcon from '../../../../../icons/TemplateIcon'
import { isConfigurationExpired, isConfigurationScheduled } from '../utils'

import ConditionTags from './ConditionTags'
import StatusLabel from './StatusLabel'
import { getGenericContext } from './utils'

import styles from './styles.css'

interface Props {
  configuration: ExtensionConfiguration
  isActive: boolean
  isDefaultContent?: boolean
  isDisabled?: boolean
  isEditing: boolean
  onClick: (configuration: ExtensionConfiguration) => void
  onDelete: (configuration: ExtensionConfiguration) => void
}

function stopPropagation(e: Pick<Event, 'preventDefault' | 'stopPropagation'>) {
  e.preventDefault()
  e.stopPropagation()
}

const messages = defineMessages({
  defaultTitle: {
    defaultMessage: 'Untitled content',
    id: 'admin/pages.editor.configuration.defaultTitle',
  },
  delete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.editor.component-list.action-menu.delete',
  },
  reset: {
    defaultMessage: 'Reset',
    id: 'admin/pages.editor.component-list.action-menu.reset',
  },
  sitewideContext: {
    defaultMessage: 'entire site',
    id: 'admin/pages.editor.configuration.scope.sitewide.context',
  },
  sitewideSaved: {
    defaultMessage: 'Saved on',
    id: 'admin/pages.editor.configuration.scope.sitewide.saved',
  },
  tag: {
    defaultMessage: 'Editing',
    id: 'admin/pages.editor.configuration.tag.editing',
  },
  templateContext: {
    defaultMessage: 'template',
    id: 'admin/pages.editor.configuration.scope.template.context',
  },
  templateSaved: {
    defaultMessage: 'Saved in',
    id: 'admin/pages.editor.configuration.scope.template.saved',
  },
  tooltip: {
    defaultMessage: 'This card is currently being edited.',
    id: 'admin/pages.editor.component-list.action-menu.tooltip',
  },
})

const Card = ({
  configuration,
  isActive = false,
  isDefaultContent = false,
  isDisabled = false,
  isEditing = false,
  intl,
  onClick,
  onDelete,
}: Props & ReactIntl.InjectedIntlProps) => {
  const editor = useEditorContext()

  const handleMainClick = React.useCallback(() => {
    onClick(configuration)
  }, [configuration, onClick])

  const handleMainKeyDown = useKeydownFromClick(handleMainClick)

  const stopPropagationByKeyDown = useKeydownFromClick(stopPropagation)

  const appName = React.useMemo(() => {
    if (!isDefaultContent) {
      return null
    }

    const splitOrigin = configuration.origin && configuration.origin.split('@')

    return splitOrigin && splitOrigin[0]
  }, [configuration.origin, isDefaultContent])

  const conditionPageContext = configuration.condition.pageContext

  const conditions = configuration.condition.statements

  const scope = React.useMemo(
    () =>
      getGenericContext({
        context: conditionPageContext,
        isSitewide: editor.blockData.isSitewide || false,
      }),
    [conditionPageContext, editor.blockData.isSitewide]
  )

  const iconByScope: Record<
    'sitewide' | 'template',
    JSX.Element
  > = React.useMemo(
    () => ({
      sitewide: <EarthIcon />,
      template: <TemplateIcon />,
    }),
    []
  )

  const status = React.useMemo(() => {
    if (isActive) {
      return 'active'
    }

    if (
      isConfigurationScheduled(configuration) &&
      !isConfigurationExpired(configuration)
    ) {
      return 'scheduled'
    }

    return 'inactive'
  }, [configuration, isActive])

  const menuOptions = React.useMemo(
    () => [
      {
        isDangerous: true,
        label: intl.formatMessage(
          isDefaultContent ? messages.reset : messages.delete
        ),
        onClick: () => onDelete(configuration),
      },
    ],
    [configuration, intl, isDefaultContent, onDelete]
  )

  return (
    <div
      className={`relative mh5 mv5 pa5 br3 bg-action-secondary hover-bg-action-secondary outline-0 ${
        !isDisabled ? 'pointer' : ''
      }`}
      onClick={handleMainClick}
      onKeyDown={handleMainKeyDown}
      role="button"
      tabIndex={0}
    >
      <StatusLabel type={status} />

      <div className="c-on-base">
        {configuration.label ||
          intl.formatMessage({
            id: 'admin/pages.editor.configuration.defaultTitle',
          })}
      </div>

      {conditions.length > 0 && <ConditionTags conditions={conditions} />}

      {scope !== 'page' && (
        <div className="mt5">
          <FormattedMessage
            id={`admin/pages.editor.configuration.scope.${scope}.saved`}
          >
            {message => (
              <div className="flex items-center">
                {iconByScope[scope]}

                <span className="ml2 f6">
                  {message}{' '}
                  <FormattedMessage
                    id={`admin/pages.editor.configuration.scope.${scope}.context`}
                  >
                    {message => <span className="fw5">{message}</span>}
                  </FormattedMessage>
                </span>
              </div>
            )}
          </FormattedMessage>
        </div>
      )}

      {appName && (
        <div className="mt5">
          <FormattedMessage
            defaultMessage="Created by {name}"
            id="admin/pages.editor.configuration.createdBy"
            values={{ name: appName }}
          >
            {message => <div className="mt3 f7 c-muted-2">{message}</div>}
          </FormattedMessage>
        </div>
      )}

      <div
        className="absolute top-0 right-0 mt1"
        id="action-menu-parent"
        onClick={stopPropagation}
        onKeyDown={stopPropagationByKeyDown}
        role="button"
        tabIndex={0}
      >
        <ActionMenu options={menuOptions} />
      </div>

      {isEditing && (
        <div
          className={
            'absolute bottom-1 right-1 ' +
            styles['editor-configuration-card-tag-editing']
          }
        >
          <Tag size="small">{intl.formatMessage(messages.tag)}</Tag>
        </div>
      )}
    </div>
  )
}

export default injectIntl(Card)
