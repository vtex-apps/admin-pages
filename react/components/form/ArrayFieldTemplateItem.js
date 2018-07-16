import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import { Transition } from 'react-spring'

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
    showDragHandle: PropTypes.bool,
  }

  handleLabelClick = e => {
    const { isOpen, onOpen, onClose } = this.props

    if (isOpen) {
      onClose(e)
    } else {
      onOpen(e)
    }
  }

  renderChildren = styles => {
    const { children } = this.props

    return (
      <div style={styles}>
        {children}
      </div>
    )
  }

  render() {
    const {
      children,
      schema,
      formIndex,
      hasRemove,
      onDropIndexClick,
      isOpen,
      showDragHandle,
    } = this.props

    const title = children.props.formData.__editorItemTitle || schema.items.properties.__editorItemTitle.default

    return (
      <div className={`accordion-item bb b--light-silver ${showDragHandle ? '' : 'accordion-item--handle-hidden'}`}>
        <div className="accordion-label" onClick={this.handleLabelClick}>
          <div className="flex items-center">
            {showDragHandle && <Handle />}
            <label className="f6 accordion-label-title">
              {title}
            </label>
          </div>
          <div className="flex items-center accordion-label-buttons">
            {hasRemove && (
              <button
                className="accordion-icon-button accordion-icon-button--remove"
                onClick={stopPropagation(onDropIndexClick(formIndex))}
              >
                <TrashSimple size={15} />
              </button>
            )}
          </div>
        </div>
        <div
          className={`accordion-content ${isOpen ? 'accordion-content--open' : ''}`}
        >
          <Transition
            keys={isOpen ? ['children'] : []}
            from={{ opacity: 0, height: 0 }}
            enter={{ opacity: 1, height: 'auto' }}
            leave={{ opacity: 0, height: 0 }}
          >
            {isOpen ? [this.renderChildren] : []}
          </Transition>
        </div>
      </div>
    )
  }
}

export default SortableElement(ArrayFieldTemplateItem)
