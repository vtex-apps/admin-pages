import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Button, IconPlus, } from 'vtex.styleguide'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

class ArrayFieldTemplate extends React.Component{
  render(){
    return (
    <div>
      {this.props.items.map(element => (
        <React.Fragment>
          <ArrayFieldTemplateItem element={element} />
          <hr />
        </React.Fragment>
      ))}
      <div className="pt4">
        {
          this.props.canAdd && 
          <Button variation="secondary" size="small" onClick={this.props.onAddClick}>
            + Add More
          </Button>
        }
      </div>
    </div>
    )
  }
}

export default ArrayFieldTemplate