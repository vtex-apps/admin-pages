import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import { Toggle as StyleguideToggle } from 'vtex.styleguide'

interface Props {
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
    label={label}
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

export default Toggle
