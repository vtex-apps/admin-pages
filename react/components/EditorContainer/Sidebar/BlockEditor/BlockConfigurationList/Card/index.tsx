import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import ActionMenu from '../../../../../ActionMenu'
import EarthIcon from '../../../../../icons/EarthIcon'
import PageIcon from '../../../../../icons/PageIcon'
import TemplateIcon from '../../../../../icons/TemplateIcon'

import ConditionTags from './ConditionTags'
import { getGenericContext } from './utils'

import './styles.css'

interface Props {
  configuration: ExtensionConfiguration
  isDisabled?: boolean
  isSitewide: boolean
  isDefaultContent?: boolean
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
  pageContext: {
    defaultMessage: 'this page',
    id: 'admin/pages.editor.configuration.scope.page.context',
  },
  pageSaved: {
    defaultMessage: 'Saved on',
    id: 'admin/pages.editor.configuration.scope.page.saved',
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
  templateContext: {
    defaultMessage: 'template',
    id: 'admin/pages.editor.configuration.scope.template.context',
  },
  templateSaved: {
    defaultMessage: 'Saved in',
    id: 'admin/pages.editor.configuration.scope.template.saved',
  },
})

const Card = ({
  configuration,
  isDefaultContent = false,
  isDisabled = false,
  intl,
  isSitewide,
  onClick,
  onDelete,
}: Props & ReactIntl.InjectedIntlProps) => {
  const handleMainClick = React.useCallback(() => {
    if (!isDisabled) {
      onClick(configuration)
    }
  }, [configuration, isDisabled, onClick])

  const handleMainKeyDown = useKeydownFromClick(handleMainClick)

  const stopPropagationByKeyDown = useKeydownFromClick(stopPropagation)

  const actionMenuOptions = [
    {
      label: intl.formatMessage(
        isDefaultContent ? messages.reset : messages.delete
      ),
      onClick: () => onDelete(),
    },
  ]

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
        isSitewide,
      }),
    [conditionPageContext, isSitewide]
  )

  const iconByScope: Record<typeof scope, JSX.Element> = React.useMemo(
    () => ({
      page: <PageIcon />,
      sitewide: <EarthIcon />,
      template: <TemplateIcon />,
    }),
    []
  )

  return (
    <div
      className={`relative mh5 mt5 pa5 ba br2 b--action-secondary bg-action-secondary hover-bg-action-secondary outline-0 ${
        !isDisabled ? 'pointer' : ''
      }`}
      onClick={handleMainClick}
      onKeyDown={handleMainKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="c-on-base">
        {configuration.label ||
          intl.formatMessage({
            id: 'admin/pages.editor.configuration.defaultTitle',
          })}
      </div>

      <ConditionTags conditions={conditions} />

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

        {appName && (
          <FormattedMessage
            defaultMessage="Created by {name}"
            id="admin/pages.editor.configuration.createdBy"
            values={{ name: appName }}
          >
            {message => <div className="mt3 f7 c-muted-2">{message}</div>}
          </FormattedMessage>
        )}
      </div>

      <div
        className="absolute top-0 right-0 mt1 outline-0"
        id="action-menu-parent"
        onClick={stopPropagation}
        onKeyDown={stopPropagationByKeyDown}
        role="button"
        tabIndex={0}
      >
        <ActionMenu options={actionMenuOptions} />
      </div>
    </div>
  )
}

export default injectIntl(Card)
