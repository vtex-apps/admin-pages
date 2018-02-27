import React from 'react'
import PropTypes from 'prop-types'

export default function ObjectFieldTemplate(props) {
  return (
    <div>
      {props.properties.map(prop => prop.content)}
    </div>
  )
}

ObjectFieldTemplate.propTypes = {
  properties: PropTypes.array,
}
