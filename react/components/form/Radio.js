import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { Radio as StyleguideRadio } from 'vtex.styleguide'

export default class Radio extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  getLabel = (item, index) => {
    const { schema: { enumNames } } = this.props

    return enumNames && enumNames.length >= index
      ? enumNames[index]
      : item && item.toString()
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
              checked={this.props.value === item}
              id={`${id}-${index}`}
              key={`${id}-${index}`}
              label={this.getLabel(item, index)}
              name={name || `${id}-group`}
              onChange={event => this.handleSelection(event, item)}
              value={item}
            />
          ))}
      </Fragment>
    )
  }
}
