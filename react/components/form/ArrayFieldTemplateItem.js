import PropTypes from 'prop-types'
import React from 'react'
import { Button, IconArrowUp, IconArrowDown, IconDelete } from 'vtex.styleguide'

export default class ArrayFieldTemplateItem extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    hasMoveUp: PropTypes.bool,
    hasMoveDown: PropTypes.bool,
    onReorderClick: PropTypes.func,
    hasRemove: PropTypes.bool,
    onDropIndexClick: PropTypes.func,
    schema: PropTypes.object,
  }

  state = {
    isOpen: false,
  }

  container = React.createRef()

  render() {
    const {
      children,
      index,
      hasMoveUp,
      hasMoveDown,
      onReorderClick,
      hasRemove,
      onDropIndexClick,
    } = this.props

    return (
      <div
        ref={this.container}
        style={{
          transition: 'height 300ms ease-in-out, opacity 150ms ease-in-out',
        }}
      >
        <div className="flex justify-between">
          <div className="flex items-center">
            <span style={{
              'border': '2px solid #f2f2f2',
              'border-radius': '5px',
              'padding': '3px 8px 3px 8px',
              'font': '8px #bfbfbf',
              'font-weight': 'bold',
            }}>
              {index + 1}
            </span>
            <label style={{
              'padding': '3px 8px 3px 8px',
              'font': '8px #bfbfbf',
              'font-weight': 'bold',
            }}>
              {children.props.schema.title}
            </label>
          </div>
          <div className="flex">
            {hasMoveDown && <button
              style={{
                'padding': '3px',
                'background': 'none',
                'border': 'none',
                'cursor': 'pointer',
              }}
              onClick={onReorderClick(
                index,
                index + 1
              )}>
              <IconArrowDown size="12" />
            </button>}
            {hasMoveUp && <button
              style={{
                'padding': '3px',
                'background': 'none',
                'border': 'none',
                'cursor': 'pointer',
              }}
              onClick={onReorderClick(
                index,
                index - 1
              )}>
              <IconArrowUp size="12" />
            </button>}
            {hasRemove && (
              <Button
                size="small"
                variation="tertiary"
                onClick={onDropIndexClick(index)}
              >
                <IconDelete size="15" />
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    )
  }
}
