import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Button, IconArrowUp, IconArrowDown, IconPlus, IconDelete, Badge } from 'vtex.styleguide'

export default class ArrayFieldTemplateItem extends React.Component {
  constructor(props){
    super(props)

    this.container=React.createRef()
  }

  render(){
    const { element } = this.props

    return (
      <div 
        ref={this.container}
        style={{
          transition:'height 300ms ease-in-out, opacity 150ms ease-in-out',
        }}>
        <div className="flex justify-between">
          <div className="flex items-center">
            <span style={{
              "border":"2px solid #f2f2f2",
              "border-radius": "5px",
              "padding":"3px 8px 3px 8px",
              "font": "8px #bfbfbf",
              "font-weight": "bold"
            }}>
              {element.index + 1}
            </span>
            <label style={{
              "padding":"3px 8px 3px 8px",
              "font": "8px #bfbfbf",
              "font-weight": "bold"
            }}>
                {element.children.props.schema.title}
            </label>
          </div>
          <div className="flex">
            {element.hasMoveDown && <button
              style={{
                "padding":"3px",
                "background": "none",
                "border": "none",
                "cursor": "pointer"
              }}
              onClick={element.onReorderClick(
                element.index,
                element.index + 1
              )}>
              <IconArrowDown size="12"/>
            </button>}
            {element.hasMoveUp && <button
              style={{
                "padding":"3px",
                "background": "none",
                "border": "none",
                "cursor": "pointer"
              }}
              onClick={element.onReorderClick(
                element.index,
                element.index - 1
              )}>
              <IconArrowUp size="12" />
            </button>}
            {element.hasRemove && (
              <Button size="small" variation="tertiary" 
                onClick={element.onDropIndexClick(element.index)}>
                <IconDelete size="15" />
              </Button>
            )}
          </div>
        </div>
        {element.children}
      </div>
    )
  }
}