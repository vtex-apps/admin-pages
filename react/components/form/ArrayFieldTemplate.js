import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Button, IconArrowUp, IconArrowDown, IconPlus, } from 'vtex.styleguide'

const ArrayFieldTemplate = (props) => ( 
    <div>
      {props.items.map(element => (
        <React.Fragment>
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
              <Button size="small" variation="danger" onClick={element.onDropIndexClick(element.index)}>
                Remove
              </Button>
            )}
          </div>
          <hr/>
        </React.Fragment>
      ))}
      {props.canAdd && <Button variation="primary" onClick={props.onAddClick}><IconPlus color="currentColor" /> Add banner</Button>}
    </div>
)

export default ArrayFieldTemplate