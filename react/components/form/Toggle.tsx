import React from 'react'
import { useIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Toggle as StyleguideToggle } from 'vtex.styleguide'

import { CustomWidgetProps } from './typings'

const Toggle: React.FunctionComponent<CustomWidgetProps> = ({
  disabled,
  id,
  label,
  onChange,
  readonly,
  schema: { disabled: disabledBySchema },
  value,
}) => {
  const intl = useIntl()

  return (
    <StyleguideToggle
      checked={value}
      disabled={disabled || disabledBySchema || readonly}
      id={id}
      label={formatIOMessage({ id: label, intl })}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.checked)
      }
    />
  )
}

Toggle.defaultProps = {
  disabled: false,
  readonly: false,
}

export default Toggle
