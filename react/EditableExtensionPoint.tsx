import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { EditorContext } from './components/EditorContext'

interface EditableExtensionPointProps {
  children: any
  component: string
  props: any
  treePath: string
}

interface EditableExtensionPointState {
  mouseOver: boolean
}

class EditableExtensionPoint extends Component<EditableExtensionPointProps, EditableExtensionPointState> {
  public static propTypes = {
    children: PropTypes.node,
    component: PropTypes.string,
    props: PropTypes.object,
    treePath: PropTypes.string,
  }

  constructor(props: EditableExtensionPointProps) {
    super(props)
    this.state = {
      mouseOver: false,
    }
  }

  public handleEditClick = (context: EditorContext) => (event: any) => {
    const { editExtensionPoint } = context
    editExtensionPoint(this.props.treePath)
    this.setState({ mouseOver: false })
    event.stopPropagation()
  }

  public handleMouseOver = (event: any) => {
    this.setState({ mouseOver: true })
    event.stopPropagation()
  }

  public handleMouseOut = (event: any) => {
    this.setState({ mouseOver: false })
    event.stopPropagation()
  }

  public isEmptyExtensionPoint = (component: string) =>
    /vtex\.pages-editor@.*\/EmptyExtensionPoint/.test(component)

  public render() {
    return (
      <EditorContext.Consumer>
        {(context: EditorContext) => {
          const { children, component, treePath } = this.props
          const { mouseOver } = this.state
          const { editMode, editTreePath, highlightTreePath } = context

          const isEmpty = this.isEmptyExtensionPoint(component)
          const zIndex = treePath.split('/').length + 1
          const isHighlight = highlightTreePath === treePath || mouseOver
          const editableClasses = isHighlight ? `br2 pointer ${!isEmpty ? 'b--blue b--dashed ba bg-white o-50' : ''}` : ''
          const overlayClasses = editMode && !editTreePath || isHighlight ? `w-100 h-100 min-h-2 absolute ${editableClasses}` : ''
          return (
            <div className="relative" onMouseOver={editMode ? this.handleMouseOver : undefined} onMouseOut={editMode ? this.handleMouseOut : undefined}>
              <div className={overlayClasses} onClick={this.handleEditClick(context)} style={{ zIndex }}></div>
              {children}
            </div>
          )
        }}
      </EditorContext.Consumer>
    )
  }
}

export default EditableExtensionPoint
