import PropTypes from 'prop-types'
import React, { Component } from 'react'

import HitUp from '../icons/HitUp'
import HitDown from '../icons/HitDown'
import TrashSimple from '../icons/TrashSimple'

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
            {hasMoveUp && (
              <button
                className="accordion-icon-button accordion-icon-button--up"
                onClick={stopPropagation(onReorderClick(index, index - 1))}
              >
                <HitUp size="12" />
              </button>
            )}
            {hasMoveDown && (
              <button
                className="accordion-icon-button accordion-icon-button--down"
                onClick={stopPropagation(onReorderClick(index, index + 1))}
              >
                <HitDown size="12" />
              </button>
            )}
            {hasRemove && (
              <button
                className="accordion-icon-button accordion-icon-button--remove"
                onClick={stopPropagation(onDropIndexClick(index))}
                title="Delete"
              >
                <TrashSimple size="15" />
              </button>
            )}
          </div>
        </div>
        {isOpen && children}
      </div>
    )
  }
}
