import { JSONSchema6Type } from 'json-schema'
import React, { Component, Fragment } from 'react'
import {
  injectIntl,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { Radio as StyleguideRadio } from 'vtex.styleguide'

interface Props extends ComponentWithIntlProps {
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

class Radio extends Component<RadioProps, State> {
  public constructor(props: RadioProps) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  public render() {
    const { id, intl, label, name, schema } = this.props

    return (
      <Fragment>
        <span className="dib mb3 w-100">
          {formatIOMessage({ id: label, intl })}
        </span>
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
      intl,
      schema: { enumNames },
    } = this.props

    return enumNames && enumNames.length >= index
      ? formatIOMessage({ id: enumNames[index], intl })
      : item && item.toString()
  }

  private handleSelection = (
    event: React.ChangeEvent,
    value: JSONSchema6Type
  ) => {
    event.stopPropagation()

    this.setState({ value })

    this.props.onChange(value)
  }
}

export default injectIntl(Radio)
