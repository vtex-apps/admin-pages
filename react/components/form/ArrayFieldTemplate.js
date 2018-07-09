import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

const ArrayFieldTemplate = (props)=>( 
    <div>
      {console.log(props)}
      {props.items.map(element => (
        <React.Fragment>
          {element.children}
          {element.hasMoveDown && (
            <button
              onClick={element.onReorderClick(
                element.index,
                element.index + 1
              )}>
              Down
            </button>
          )}
          {element.hasMoveUp && (
            <button
              onClick={element.onReorderClick(
                element.index,
                element.index - 1
              )}>
              Up
            </button>
          )}
          {element.hasRemove && (
            <button type="button" onClick={element.onDropIndexClick(element.index)}>
              Remover
            </button>)}
          <hr/>
        </React.Fragment>
      ))}
      {props.canAdd && <button type="button" onClick={props.onAddClick}>Add banner</button>}
    </div>
)

export default ArrayFieldTemplate