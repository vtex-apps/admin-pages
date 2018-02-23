import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {getImplementation} from './utils/components'

import ComponentEditor from './components/ComponentEditor'

class EditableExtensionPoint extends Component {
  static contextTypes = {
    emitter: PropTypes.object,
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
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
    }
  }

  update = (state) => {
    this.setState(state)
  }

  subscribeToEditor = () => {
    const {emitter} = this.context
    emitter.addListener('editor:update', this.update)
  }

  unsubscribeToEditor = () => {
    const {emitter} = this.context
    emitter.removeListener('editor:update', this.update)
  }

  componentDidMount() {
    this.subscribeToEditor()
  }

  componentWillUnmount() {
    this.unsubscribeToEditor()
  }

  handleEditClick = (event) => {
    const {editExtensionPoint} = this.context
    editExtensionPoint(this.context.treePath)
    event.stopPropagation()
  }

  render() {
    const {treePath} = this.context
    const {children, component, props, ...parentProps} = this.props
    const {editMode, editTreePath} = this.state

    const Component = getImplementation(component)

    if (!Component) {
      return children || null
    }

    const zIndex = treePath.split('/').length + 1
    const editableClasses = `absolute w-100 h-100 bg-blue z-${zIndex} br2 o-20 dim pointer`
    const withOverlay = (
      <div key="editable" className="relative">
        <div className={editableClasses} onClick={this.handleEditClick}></div>
        {React.cloneElement(children, parentProps)}
      </div>
    )

    return [
      ...(editMode && !editTreePath ? [withOverlay] : [children]),
      ...(editTreePath === treePath ? [<ComponentEditor key="editor" component={component} props={props} treePath={treePath} />] : []),
    ]
  }
}

export default EditableExtensionPoint
