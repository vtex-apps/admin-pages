import React from 'react'
import { FormattedMessage } from 'react-intl'

import PaperErrorIcon from '../../../icons/PaperErrorIcon'

const UploadSuccess: React.FunctionComponent = () => (
  <div className="flex flex-column items-center justify-center">
    <PaperErrorIcon />
    <h2 className="tc fw4 mb3 mt7">
      <FormattedMessage id="pages.admin.redirects.upload-modal.fail.title" />
    </h2>
    <p className="tc c-muted-2 mt2 mb2">
      <FormattedMessage id="pages.admin.redirects.upload-modal.fail.subtitle" />
    </p>
    <p className="tc c-muted-2 mt2">
      <FormattedMessage id="pages.admin.redirects.upload-modal.fail.message" />
    </p>
  </div>
)

export default React.memo(UploadSuccess)
