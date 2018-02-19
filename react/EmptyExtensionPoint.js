import React, {Component} from 'react'

// eslint-disable-next-line
class EmptyExtensionPoint extends Component {
  render() {
    return (
      <div>
        <h1>Este é um componente vazio!</h1>
      </div>
    )
  }
}

EmptyExtensionPoint.schema = {
  type: 'object',
  properties: {},
}

export default EmptyExtensionPoint
