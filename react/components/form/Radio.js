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

  state = {
    value: this.props.value || null,
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
            schema.enum.map((item, index) => {
              let itemLabel

              if (schema.enumNames && schema.enumNames.length > 0) {
                itemLabel = schema.enumNames[index]
              } else {
                itemLabel = item && item.toString()
              }

              return (
                <StyleguideRadio
                  checked={this.props.value === item}
                  id={`${id}-${index}`}
                  key={`${id}-${index}`}
                  label={itemLabel}
                  name={name || `${id}-group`}
                  onChange={event => this.handleSelection(event, item)}
                  value={item}
                />
              )
            })
        }
      </Fragment>
    )
  }
}

