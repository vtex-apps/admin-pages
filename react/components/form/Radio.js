import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import StyleguideRadio from '@vtex/styleguide/lib/Radio'

class Radio extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value || null,
    }
  }

  handleSelection = (event, value) => {
    event.stopPropagation()

    this.setState({ value })

    this.props.onChange(value)
  }

  render() {
    const { id, label, name, schema } = this.props

    return (
      <Fragment>
        <span className="dib mb3 w-100">{label}</span>
        {schema.enum &&
          schema.enum.map((item, index) => (
            <StyleguideRadio
              checked={this.state.value === item}
              id={`${id}-${index}`}
              key={`${id}-${index}`}
              label={item && item.toString()}
              name={name || `${id}-group`}
              onChange={event => this.handleSelection(event, item)}
              value={item}
            />
          ))}
      </Fragment>
    )
  }
}

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default Radio
