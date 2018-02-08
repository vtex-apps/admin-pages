import React, {Component} from 'react'
import PropTypes from 'prop-types'

class EditableExtensionPoint extends Component {
  static contextTypes = {
    editExtensionPoint: PropTypes.func,
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    treePath: PropTypes.string,
  }

  static propTypes = {
    children: PropTypes.node,
  }

  handleEditClick = (event) => {
    const {editExtensionPoint} = this.context
    editExtensionPoint(this.context.treePath)
    event.stopPropagation()
  }

  render() {
    const {editMode, editTreePath, treePath} = this.context
    const {children, ...parentProps} = this.props

    const editable = !editTreePath && editMode
    const className = editable ? 'relative' : ''
    const zIndex = treePath.split('/').length + 1
    const editableClasses = `absolute w-100 h-100 bg-blue z-${zIndex} br2 o-20 dim pointer`

    return (
      <div className={className}>
        {editable && <div className={editableClasses} onClick={this.handleEditClick}></div>}
        {React.cloneElement(children, parentProps)}
      </div>
    )
  }
}

export default EditableExtensionPoint
