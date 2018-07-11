import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'

import TrashSimple from '../icons/TrashSimple'
import DragHandle from '../icons/DragHandle'

const stopPropagation = fn => e => {
  e.stopPropagation()
  return fn(e)
}

const Handle = SortableHandle(() => (
  <DragHandle size={12} className="accordion-handle" />
))

class ArrayFieldTemplateItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    formIndex: PropTypes.number,
    hasRemove: PropTypes.bool,
    onDropIndexClick: PropTypes.func,
    schema: PropTypes.object,
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  handleLabelClick = e => {
    const { isOpen, onOpen, onClose } = this.props

    if (isOpen) {
      onClose(e)
    } else {
      onOpen(e)
    }
  }

  render() {
    const {
      children,
      schema,
      formIndex,
      hasRemove,
      onDropIndexClick,
      isOpen,
    } = this.props

    const title = children.props.formData.__editorItemTitle || schema.items.properties.__editorItemTitle.default

    return (
      <div className="accordion-item bb b--light-silver">
        <div className="accordion-label" onClick={this.handleLabelClick}>
          <div className="flex items-center">
            <Handle />
            <label className="f6 accordion-label-title">
              {title}
            </label>
          </div>
          <div className="flex items-center accordion-label-buttons">
            {hasRemove && (
              <button
                className="accordion-icon-button accordion-icon-button--remove"
                onClick={stopPropagation(onDropIndexClick(formIndex))}
                title="Delete"
              >
                <TrashSimple size="15" />
              </button>
            )}
          </div>
        </div>
        <div className="accordion-content">
          {isOpen && children}
        </div>
      </div>
    )
  }
}

export default SortableElement(ArrayFieldTemplateItem)
