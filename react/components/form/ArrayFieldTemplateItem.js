import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { IconArrowUp, IconArrowDown, IconDelete } from 'vtex.styleguide'

const stopPropagation = fn => e => {
  e.stopPropagation()
  return fn(e)
}

export default class ArrayFieldTemplateItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    hasMoveUp: PropTypes.bool,
    hasMoveDown: PropTypes.bool,
    onReorderClick: PropTypes.func,
    hasRemove: PropTypes.bool,
    onDropIndexClick: PropTypes.func,
    schema: PropTypes.object,
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  container = React.createRef()

  handleLabelClick = () => {
    const { isOpen, onOpen, onClose } = this.props

    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }

  render() {
    const {
      children,
      index,
      hasMoveUp,
      hasMoveDown,
      onReorderClick,
      hasRemove,
      onDropIndexClick,
      isOpen,
    } = this.props

    return (
      <div
        ref={this.container}
        style={{
          transition: 'height 300ms ease-in-out, opacity 150ms ease-in-out',
        }}
      >
        <div className="accordion-label" onClick={this.handleLabelClick}>
          <div className="flex items-center">
            <span className="f6 accordion-label-title accordion-label-title--index">
              {index + 1}
            </span>
            <label className="f6 accordion-label-title">
              {children.props.schema.title}
            </label>
          </div>
          <div className="flex items-center accordion-label-buttons">
            {hasMoveUp && <button
              className="accordion-icon-button accordion-icon-button--up"
              onClick={stopPropagation(onReorderClick(
                index,
                index - 1
              ))}>
              <IconArrowUp size="12" color="#969799" />
            </button>}
            {hasMoveDown && <button
              className="accordion-icon-button accordion-icon-button--down"
              onClick={stopPropagation(
                onReorderClick(index, index + 1)
              )}>
              <IconArrowDown size="12" color="#969799" />
            </button>}
            {hasRemove && (
              <button
                className="accordion-icon-button accordion-icon-button--remove"
                onClick={stopPropagation(onDropIndexClick(index))}
              >
                <IconDelete size="15" color="#969799" />
              </button>
            )}
          </div>
        </div>
        {isOpen && children}
      </div>
    )
  }
}
