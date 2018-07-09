import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Button, IconArrowUp, IconArrowDown, IconPlus, } from 'vtex.styleguide'

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
        {element.children}
        <div className="flex justify-between">
          <div className="flex">
            <div className="mr1">
              <Button
                size="small"
                variation="secondary"
                disabled={!element.hasMoveDown}
                onClick={element.onReorderClick(
                  element.index,
                  element.index + 1
                )}>
                <IconArrowDown color="currentColor" />
              </Button>
            </div>
            <Button
              size="small"
              variation="secondary"
              disabled={!element.hasMoveUp}
              onClick={element.onReorderClick(
                element.index,
                element.index - 1
              )}>
              <IconArrowUp color="currentColor" />
            </Button>
          </div>
          {element.hasRemove && (
            <Button size="small" variation="danger" onClick={/*()=>{
                // const el = this.container.current
                // const bounds = el.getBoundingClientRect()
                // el.style.height = bounds.height+'px'
                // el.style.overflowY = 'hidden'

                // setTimeout(() => {
                //   el.style.height = '100px'
                //   // el.style.opacity = '0'
                // }, 1)

                // setTimeout(element.onDropIndexClick(element.index), 400)
                }*/
                element.onDropIndexClick(element.index)
              }>
              Remove
            </Button>
          )}
        </div>
      </div>
    )
  }
}