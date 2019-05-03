import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { Toggle as StyleguideToggle } from 'vtex.styleguide'

interface Props extends InjectedIntlProps {
  label?: string
  autofocus?: boolean
  disabled?: boolean
  id?: string
  onChange?: React.EventHandler<React.ChangeEvent>
  readonly?: boolean
  schema: {
    disabled?: boolean
  }
  value?: boolean
}

const Toggle: React.FunctionComponent<WidgetProps & Props> = ({
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
