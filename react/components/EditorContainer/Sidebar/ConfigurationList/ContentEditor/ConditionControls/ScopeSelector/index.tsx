import React, { Fragment } from 'react'
import {
  defineMessages,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'

import { getScopeStandardOptions } from './utils'

interface CustomProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  pageContext: PageContext
  scope: ConfigurationScope
  isSitewide: boolean
}

type Props = CustomProps & InjectedIntlProps

// Messages used in getScopeStandardOptions
defineMessages({
  brand: {
    defaultMessage: 'this brand',
    id: 'admin/pages.editor.components.condition.scope.entity.brand',
  },
  category: {
    defaultMessage: 'this category',
    id: 'admin/pages.editor.components.condition.scope.entity.category',
  },
  department: {
    defaultMessage: 'this department',
    id: 'admin/pages.editor.components.condition.scope.entity.department',
  },
  product: {
    defaultMessage: 'this product',
    id: 'admin/pages.editor.components.condition.scope.entity.product',
  },
  route: {
    defaultMessage: 'this URL',
    id: 'admin/pages.editor.components.condition.scope.entity.route',
  },
  search: {
    defaultMessage: 'this search',
    id: 'admin/pages.editor.components.condition.scope.entity.search',
  },
  sitewide: {
    defaultMessage: 'the entire site',
    id: 'admin/pages.editor.components.condition.scope.sitewide',
  },
  subcategory: {
    defaultMessage: 'this subcategory',
    id: 'admin/pages.editor.components.condition.scope.entity.subcategory',
  },
  template: {
    defaultMessage: 'this template',
    id: 'admin/pages.editor.components.condition.scope.template',
  },
  title: {
    defaultMessage: 'Apply to',
    id: 'admin/pages.editor.components.condition.scope.title',
  },
})

const ScopeSelector: React.FunctionComponent<Props> = ({
  intl,
  isSitewide,
  onChange,
  pageContext,
  scope,
}) => {
  const standardOptions = getScopeStandardOptions(intl, pageContext)

  return (
    <Fragment>
      <FormattedMessage id="admin/pages.editor.components.condition.scope.title">
        {message => <div className="mb5">{message}</div>}
      </FormattedMessage>
      <RadioGroup
        disabled={isSitewide}
        name="scopes"
        onChange={onChange}
        options={
          isSitewide
            ? [
                {
                  label: intl.formatMessage({
                    id:
                      'admin/pages.editor.components.condition.scope.sitewide',
                  }),
                  value: 'sitewide',
                },
              ]
            : standardOptions
        }
        value={scope}
      />
    </Fragment>
  )
}

export default injectIntl(ScopeSelector)
