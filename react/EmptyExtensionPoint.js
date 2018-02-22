import React, {Component} from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
class EmptyExtensionPoint extends Component {
  static contextTypes = {
    editMode: PropTypes.bool,
  }

  render() {
    const {editMode} = this.context
    const className = `${editMode ? 'ba b--silver b--dashed mv6 pv6 tc' : 'dn'}`

    return (
      <div className={className}>
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
