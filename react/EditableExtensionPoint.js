import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ComponentEditor from './components/ComponentEditor'

class EditableExtensionPoint extends Component {
  static contextTypes = {
    emitter: PropTypes.object,
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
    mouseOverExtensionPoint: PropTypes.func,
    treePath: PropTypes.string,
    mouseOverTreePath: PropTypes.string,
  }

  static propTypes = {
    children: PropTypes.node,
    component: PropTypes.string,
    props: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      editMode: context.editMode,
      editTreePath: context.editTreePath,
      mouseOverTreePath: context.mouseOverTreePath,
    }
  }

  update = (state) => {
    this.setState(state)
  }

  subscribeToEditor = () => {
    const { emitter } = this.context
    emitter.addListener('editor:update', this.update)
  }

  unsubscribeToEditor = () => {
    const { emitter } = this.context
    emitter.removeListener('editor:update', this.update)
  }

  componentDidMount() {
    this.subscribeToEditor()
  }

  componentWillUnmount() {
    this.unsubscribeToEditor()
  }

  handleEditClick = (event) => {
    const { editExtensionPoint } = this.context
    editExtensionPoint(this.context.treePath)
    event.stopPropagation()
  }

  handleMouseOver = (event) => {
    this.context.mouseOverExtensionPoint(this.context.treePath)
    event.stopPropagation()
  }

  handleMouseOut = (event) => {
    this.context.mouseOverExtensionPoint(null)
    event.stopPropagation()
  }

  render() {
    const { treePath } = this.context
    const { children, component, props, ...parentProps } = this.props
    const { editMode, editTreePath, mouseOverTreePath } = this.state

    const zIndex = treePath.split('/').length + 1
    const editableClasses = mouseOverTreePath === treePath ? 'bg-blue br2 o-20 pointer' : ''
    const overlayClasses = `absolute w-100 h-100 z-${zIndex} ${editableClasses}`
    const withOverlay = (
      <div key="editable" className="relative" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <div className={overlayClasses} onClick={this.handleEditClick}></div>
        {children && React.cloneElement(children, parentProps)}
      </div>
    )

    return [
      ...(editMode && !editTreePath ? [withOverlay] : [children]),
      ...(editTreePath === treePath ? [<ComponentEditor key="editor" component={component} props={props} treePath={treePath} />] : []),
    ]
  }
}

export default EditableExtensionPoint
