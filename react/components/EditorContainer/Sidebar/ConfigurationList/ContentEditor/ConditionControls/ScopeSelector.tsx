import React, { Fragment } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'

import { getScopeSitewideOption, getScopeStandardOptions } from './utils'

interface CustomProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  pageContext: PageContext
  scope: ConfigurationScope
  shouldEnableSitewide: boolean
}

type Props = CustomProps & InjectedIntlProps

const ScopeSelector: React.SFC<Props> = ({
  intl,
  onChange,
  pageContext,
  scope,
  shouldEnableSitewide,
}) => {
  const standardOptions = getScopeStandardOptions(intl, pageContext)

  return (
    <Fragment>
      <FormattedMessage id="pages.editor.components.condition.scope.title">
        {message => <div className="mb5">{message}</div>}
      </FormattedMessage>
      <RadioGroup
        name="scopes"
        onChange={onChange}
        options={
          shouldEnableSitewide
            ? [...standardOptions, getScopeSitewideOption(intl)]
            : standardOptions
        }
        value={scope}
      />
    </Fragment>
  )
}

export default injectIntl(ScopeSelector)
