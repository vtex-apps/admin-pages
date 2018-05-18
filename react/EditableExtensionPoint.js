import React, { Component, Fragment } from 'react'
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
      mouseOverTreePath: false,
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
    this.setState({ mouseOver: false })
    event.stopPropagation()
  }

  handleMouseOver = (event) => {
    this.setState({ mouseOver: true })
    event.stopPropagation()
  }

  handleMouseOut = (event) => {
    this.setState({ mouseOver: false })
    event.stopPropagation()
  }

  isEmptyExtensionPoint = (component) =>
    /vtex\.pages-editor@.*\/EmptyExtensionPoint/.test(component)

  render() {
    const { treePath } = this.context
    const { children, component, props, ...parentProps } = this.props
    const { editMode, editTreePath, mouseOver } = this.state

    const isEmpty = this.isEmptyExtensionPoint(component)
    const zIndex = treePath.split('/').length + 1
    const editableClasses = mouseOver ? `br2 pointer ${!isEmpty ? 'b--blue b--dashed ba bg-white o-50' : ''}` : ''
    const overlayClasses = `w-100 h-100 min-h-2 z-${zIndex} absolute ${editableClasses}`
    const withOverlay = (
      <div className="relative" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <div className={overlayClasses} onClick={this.handleEditClick}></div>
        {children && React.cloneElement(children, parentProps)}
      </div>
    )

    return (
      <Fragment>
        {editMode && !editTreePath ? withOverlay : children}
        {editTreePath === treePath && <ComponentEditor component={component} props={props} treePath={treePath} />}
      </Fragment>
    )
  }
}

export default EditableExtensionPoint
