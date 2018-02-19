import React, {Component} from 'react'

// eslint-disable-next-line
class EmptyExtensionPoint extends Component {
  render() {
    return (
      <div className="ba b--silver b--dashed mv6 pv6 tc">
        <div className="fw3 f3">This is an empty component</div>
        <div className="fw7 f6 pt4">Click to edit it</div>
      </div>
    )
  }
}

EmptyExtensionPoint.schema = {
  type: 'object',
  properties: {},
}

export default EmptyExtensionPoint
