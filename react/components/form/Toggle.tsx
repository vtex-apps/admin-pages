import PropTypes from 'prop-types'
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

const Toggle: React.SFC<WidgetProps & Props> = ({
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
    size="small"
  />
)

Toggle.defaultProps = {
  autofocus: false,
  disabled: false,
  readonly: false,
}

Toggle.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  schema: PropTypes.shape({
    disabled: PropTypes.bool,
  }).isRequired,
  value: PropTypes.bool,
}

export default Toggle
