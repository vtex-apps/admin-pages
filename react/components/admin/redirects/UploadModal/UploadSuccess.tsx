import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import PaperSuccessIcon from '../../../icons/PaperSuccessIcon'

interface Props {
  onButtonClick: () => void
}

const UploadSuccess: React.FunctionComponent<Props> = ({ onButtonClick }) => (
  <div className="flex flex-column items-center justify-center">
    <PaperSuccessIcon />
    <h2 className="tc fw4 mb3 mt7">
      <FormattedMessage id="admin/pages.admin.redirects.upload-modal.success.title" />
    </h2>
    <p className="tc c-muted-2 mt2 mb6">
      <FormattedMessage id="admin/pages.admin.redirects.upload-modal.success.subtitle" />
    </p>
    <Button onClick={onButtonClick}>
      <FormattedMessage id="admin/pages.admin.redirects.upload-modal.success.button" />
    </Button>
  </div>
)

export default React.memo(UploadSuccess)
