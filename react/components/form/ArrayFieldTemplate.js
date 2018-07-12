import PropTypes from 'prop-types'
import React, { Fragment, Component } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { Button } from 'vtex.styleguide'

import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

function getHelperDimensions({ node }) {
  const label = node.querySelector('.accordion-label')

  return {
    width: node.offsetWidth,
    height: label.offsetHeight,
  }
}

const ArrayList = SortableContainer(({ items, schema, openedItem, onOpen, onClose, sorting }) => (
  <div className={`accordion-list-container ${sorting ? 'accordion-list-container--sorting' : ''}`}>
    {items.map(element => (
      <ArrayFieldTemplateItem
        key={element.index}
        schema={schema}
        isOpen={openedItem === element.index}
        onOpen={onOpen(element.index)}
        onClose={onClose}
        formIndex={element.index}
        {...element}
      />
    ))}
  </div>
))

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

  handleOpen = index => e => {
    e.stopPropagation()

    this.setState({
      openedItem: index,
    })
  }

  handleClose = () => {
    this.setState({
      openedItem: -1,
    })
  }

  handleSortStart = () => {
    this.setState({
      openedItem: -1,
      sorting: true,
    })
  }

  handleSortEnd = ({ oldIndex, newIndex }, e) => {
    const { items } = this.props
    const { onReorderClick } = items[oldIndex]

    onReorderClick(oldIndex, newIndex)(e)

    this.setState({
      sorting: false,
    })
  }

  render() {
    const { items, onAddClick, canAdd, schema } = this.props
    const { openedItem, sorting } = this.state

    return (
      <Fragment>
        <ArrayList
          items={items}
          sorting={sorting}
          schema={schema}
          openedItem={openedItem}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          onSortStart={this.handleSortStart}
          onSortEnd={this.handleSortEnd}
          helperClass="accordion-item--dragged"
          distance={5}
          lockAxis="y"
          lockToContainerEdges
          getHelperDimensions={getHelperDimensions}
          useDragHandle
        />
        <div className="pt4">
          {canAdd && (
            <Button
              variation="secondary"
              size="small"
              onClick={onAddClick}
            >
              + Add More
            </Button>
          )}
        </div>
      </Fragment>
    )
  }
}

export default ArrayFieldTemplate
