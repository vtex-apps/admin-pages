import React, { Fragment, useMemo } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'

import { getScopeStandardOptions } from './utils'

interface CustomProps {
  isDisabled: boolean
  isSitewide: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  pageContext: PageContext
  scope: ConfigurationScope
}

type Props = CustomProps & InjectedIntlProps

const ScopeSelector: React.FunctionComponent<Props> = ({
  intl,
  isDisabled,
  isSitewide,
  onChange,
  pageContext,
  scope,
}) => {
  const standardOptions = getScopeStandardOptions(intl, pageContext)
  const options = useMemo(
    () =>
      isSitewide
        ? [
            {
              label: intl.formatMessage({
                id: 'admin/pages.editor.components.condition.scope.sitewide',
              }),
              value: 'sitewide',
            },
          ]
        : standardOptions,
    [intl, isSitewide, standardOptions]
  )

  return (
    <Fragment>
      <FormattedMessage id="admin/pages.editor.components.condition.scope.title">
        {message => <div className="mb5">{message}</div>}
      </FormattedMessage>
      <RadioGroup
        disabled={isDisabled}
        name="scopes"
        onChange={onChange}
        options={options}
        value={scope}
      />
    </Fragment>
  )
}

export default React.memo(injectIntl(ScopeSelector))
