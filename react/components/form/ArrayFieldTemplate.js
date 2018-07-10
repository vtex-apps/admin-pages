import PropTypes from 'prop-types'
import React, { Fragment, Component } from 'react'
import { Button } from 'vtex.styleguide'
import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

function truncate(str) {
  const MAX_LENGTH = 7
  return str <= MAX_LENGTH ? str : str.substring(0, MAX_LENGTH).concat('...')
}

class ArrayFieldTemplate extends Component {
  static propTypes = {
    items: PropTypes.array,
    onAddClick: PropTypes.func.isRequired,
    canAdd: PropTypes.bool,
    schema: PropTypes.object,
  }

  state = {
    openedItem: 0,
  }

  handleOpen = index => () => {
    this.setState({
      openedItem: index,
    })
  }

  handleClose = () => {
    this.setState({
      openedItem: -1,
    })
  }

  render() {
    const { items, onAddClick, canAdd, schema } = this.props
    const { openedItem } = this.state

    return (
      <div>
        {items.map(element => (
          <Fragment
            key={element.index}
          >
            <ArrayFieldTemplateItem
              schema={schema}
              isOpen={openedItem === element.index}
              onOpen={this.handleOpen(element.index)}
              onClose={this.handleClose}
              {...element}
            />
            <hr style={{ height: 1, backgroundColor: '#D8D8D8', border: 'none' }} />
          </Fragment>
        ))}
        <div className="pt4">
          {canAdd && (
            <Button
              variation="secondary"
              size="small"
              onClick={onAddClick}
            >
              + Add {truncate(schema.items.title)}
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default ArrayFieldTemplate
