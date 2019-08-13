import React from 'react'
import { FormattedMessage } from 'react-intl'
import ImageIcon from '../../../images/ImageIcon'

const NoImagePlaceholder = () => (
  <div className="w-100 h-100 flex flex-column items-center justify-center bg-muted-5 br3">
    <ImageIcon />
    <FormattedMessage
      id="admin/pages.editor.components.no-image"
      defaultMessage="No image"
    >
      {text => <p className="c-muted-1 f6 mb0 mt4">{text}</p>}
    </FormattedMessage>
  </div>
)

export default React.memo(NoImagePlaceholder)
