import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Spinner } from 'vtex.styleguide'

const Loading: React.FunctionComponent = () => (
  <div className="flex flex-column items-center justify-center">
    <Spinner />
    <p className="mt4">
      <FormattedMessage id="pages.admin.redirects.upload-modal.loading" />
    </p>
  </div>
)

export default React.memo(Loading)
