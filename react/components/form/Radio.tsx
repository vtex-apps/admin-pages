import { JSONSchema6Type } from 'json-schema'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import { Radio as StyleguideRadio } from 'vtex.styleguide'

interface Props {
  label?: string
  name?: string
  schema: {
    enumNames?: string[]
  }
}

interface State {
  value?: JSONSchema6Type
}

type RadioProps = Props & WidgetProps

export default class Radio extends Component<RadioProps, State> {
  public static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  constructor(props: RadioProps) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  public render() {
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
              onChange={(event: React.ChangeEvent) =>
                this.handleSelection(event, item)
              }
              value={item}
            />
          ))}
      </Fragment>
    )
  }

  private getLabel = (item: JSONSchema6Type, index: number) => {
    const {
      schema: { enumNames },
    } = this.props

    return enumNames && enumNames.length >= index
      ? enumNames[index]
      : item && item.toString()
  }

  private handleSelection = (
    event: React.ChangeEvent,
    value: JSONSchema6Type,
  ) => {
    event.stopPropagation()

    this.setState({ value })

    this.props.onChange(value)
  }
}
