import { JSONSchema6Type } from 'json-schema'
import React, { Component, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { ColorPicker as StyleguideColorPicker} from 'vtex.styleguide'

interface Props extends InjectedIntlProps {
  label?: string
  name?: string
  schema?: {
    enumNames?: string[]
  }
}

interface State {
  value?: JSONSchema6Type,
  color: {hex: String},
  history: any
}

type ColorProps = Props & WidgetProps

class ColorPicker extends Component<ColorProps, State> {
  public static defaultProps = {
    value: "#FFFFFF"
  }

  public constructor(props: ColorProps) {
    super(props)

    let color = props.value
    var isColor  = /^#[0-9A-F]{6}$/i.test(props.value)


    if(!isColor){
      color = "#FFFFFF"
    }

    console.log(props, color);

    this.state = {
      color:{ hex: color},
      history: []
    }
  }

  public render() {
    //const { id, intl, label, name, schema } = this.props
    const { intl, label } = this.props

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{__html: `
          div#sidebar-vtex-editor, nav#admin-sidebar {width: 22em;}
          .adminpages-colorpicker .options-container{position:relative}
        `}} />

        <span className="dib mb3 w-100">
          {formatIOMessage({ id: label, intl })}
        </span>

        <div className="adminpages-colorpicker">

        <StyleguideColorPicker
          color={this.state.color}
          colorHistory={this.state.history}
          onChange={(color: String) =>
            this.handleSelection(color)
          }
        />

        </div>

      </Fragment>
    )
  }

  private handleSelection = (
    color:any|never
  ) => {
    let { history } = this.state
  
    this.setState({ color, history: [...history, color]  })
    

    this.props.onChange(color.hex)
  }
}


export default injectIntl(ColorPicker)
