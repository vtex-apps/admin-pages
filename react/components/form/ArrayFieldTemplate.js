import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

const ArrayFieldTemplate = (props)=>( 
    <div>
      {props.items.map(element => element.children)}
      {props.canAdd && <button type="button" onClick={props.onAddClick}></button>}
    </div>
)

export default ArrayFieldTemplate