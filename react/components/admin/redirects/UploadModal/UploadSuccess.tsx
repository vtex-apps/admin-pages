import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import PaperSuccessIcon from '../../../icons/PaperSuccessIcon'

const UploadSuccess: React.FunctionComponent = () => (
  <div className="flex flex-column items-center justify-center">
    <PaperSuccessIcon />
    <h2 className="tc fw4 mb3 mt7">
      <FormattedMessage id="pages.admin.redirects.upload-modal.success.title" />
    </h2>
    <p className="tc c-muted-2 mt2 mb6">
      <FormattedMessage id="pages.admin.redirects.upload-modal.success.subtitle" />
    </p>
    <Button>
      <FormattedMessage id="pages.admin.redirects.upload-modal.success.button" />
    </Button>
  </div>
)

export default React.memo(UploadSuccess)