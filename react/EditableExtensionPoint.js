import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {getImplementation} from './utils/components'

class EditableExtensionPoint extends Component {
  static contextTypes = {
    editExtensionPoint: PropTypes.func,
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
  }

  static propTypes = {
    __originalComponent: PropTypes.element.isRequired,
    __treePath: PropTypes.string,
    children: PropTypes.node,
  }

  handleEditClick = (event) => {
    const {editExtensionPoint} = this.context
    editExtensionPoint(this.props.__treePath)
    event.stopPropagation()
  }

  render() {
    const {editMode, editTreePath} = this.context
    const {__originalComponent: component, __treePath: treePath, children, ...parentProps} = this.props

    const OriginalComponent = getImplementation(component)
    const editable = !editTreePath && editMode
    const className = editable ? 'relative' : ''
    const zIndex = treePath.split('/').length + 1
    const editableClasses = `absolute w-100 h-100 bg-blue z-${zIndex} br2 o-20 dim pointer`

    return (
      <div className={className}>
        {editable && <div className={editableClasses} onClick={this.handleEditClick}></div>}
        <OriginalComponent {...parentProps}>{children}</OriginalComponent>
      </div>
    )
  }
}

export const editableExtensionPointKey = '__EDITABLE_EXTENSION_POINT__'

global.__RENDER_6_COMPONENTS__[editableExtensionPointKey] = EditableExtensionPoint

export default EditableExtensionPoint
