import React, { Fragment } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'

import { getScopeStandardOptions } from './utils'

interface CustomProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  pageContext: PageContext
  scope: ConfigurationScope
  isSitewide: boolean
}

type Props = CustomProps & InjectedIntlProps

const ScopeSelector: React.SFC<Props> = ({
  intl,
  isSitewide,
  onChange,
  pageContext,
  scope,
}) => {
  const standardOptions = getScopeStandardOptions(intl, pageContext)

  return (
    <Fragment>
      <FormattedMessage id="pages.editor.components.condition.scope.title">
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
                    id: 'pages.editor.components.condition.scope.sitewide',
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
