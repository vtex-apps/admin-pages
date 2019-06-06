import React from 'react'

import I18nInput from './I18nInput'
import { CustomWidgetProps } from './typings'

const RichText: React.FunctionComponent<CustomWidgetProps> = props => (
  <I18nInput {...props} isTextarea />
)

export default RichText
