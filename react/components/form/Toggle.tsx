import React from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Toggle as StyleguideToggle } from 'vtex.styleguide'

import { CustomWidgetProps } from './typings'

type Props = CustomWidgetProps & WrappedComponentProps

const Toggle: React.FunctionComponent<Props> = ({
  autofocus,
  disabled,
  id,
  intl,
  label,
  onChange,
  readonly,
  schema: { disabled: disabledBySchema },
  value,
}) => (
  <StyleguideToggle
    autoFocus={autofocus}
    checked={value}
    disabled={disabled || disabledBySchema || readonly}
    id={id}
    label={formatIOMessage({ id: label, intl })}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(event.target.checked)
    }
  />
)

Toggle.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
}

export default injectIntl(Toggle)
