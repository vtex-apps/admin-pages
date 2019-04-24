import React from 'react'
import { FormattedMessage } from 'react-intl'

const Loader = () => (
  <FormattedMessage id="admin/pages.admin.loading">
    {text => (
      <span>
        {text}
        &hellip;
      </span>
    )}
  </FormattedMessage>
)

export default Loader
