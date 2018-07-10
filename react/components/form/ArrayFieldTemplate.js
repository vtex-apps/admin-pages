import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Button } from 'vtex.styleguide'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

class ArrayFieldTemplate extends React.Component{
  static propTypes = {
    items: PropTypes.array,
    onAddClick: PropTypes.func.isRequired,
    canAdd: PropTypes.bool,
    schema: PropTypes.object,
  }

  render() {
    const { items, onAddClick, canAdd, schema } = this.props

    return (
      <div>
        {items.map(element => (
          <Fragment
            key={element.index}
          >
            <ArrayFieldTemplateItem schema={schema} {...element} />
            <hr />
          </Fragment>
        ))}
        <div className="pt4">
          {canAdd && (
            <Button variation="secondary" size="small" onClick={onAddClick}>
              + Add More
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default ArrayFieldTemplate
