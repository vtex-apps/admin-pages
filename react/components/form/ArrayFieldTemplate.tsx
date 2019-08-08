import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import {
  Dimensions,
  SortableContainerProps,
  SortStart,
} from 'react-sortable-hoc'
import { ButtonWithIcon } from 'vtex.styleguide'

import AddIcon from '../icons/AddIcon'

import ArrayList from './ArrayList'
import SimpleFormattedMessage from './SimpleFormattedMessage'

interface Props {
  canAdd?: boolean
  items?: ArrayFieldTemplateProps['items']
  onAddClick?: (event: Event) => void
  schema?: object
}

interface State {
  sorting?: boolean
  openedItems: number[]
}

function getHelperDimensions({ node }: SortStart): Dimensions {
  const label = node.querySelector('.accordion-label') as HTMLElement
  const width = node instanceof HTMLElement ? node.offsetWidth : 0

  return {
    height: label && label.offsetHeight,
    width,
  }
}

class ArrayFieldTemplate extends Component<
  Props & ArrayFieldTemplateProps,
  State
> {
  public static propTypes = {
    canAdd: PropTypes.bool,
    items: PropTypes.array,
    onAddClick: PropTypes.func.isRequired,
    schema: PropTypes.object,
  }

  public constructor(props: Props & ArrayFieldTemplateProps) {
    super(props)
    this.state = {
      openedItems: [],
    }
  }

  public render() {
    const { canAdd, items, schema, title } = this.props
    const { openedItems: openedItem, sorting } = this.state

    return (
      <Fragment>
        {title && (
          <FormattedMessage id={title}>
            {text => <h4 className="mb4 mt0">{text}</h4>}
          </FormattedMessage>
        )}
        <ArrayList
          pressDelay={200}
          getHelperDimensions={getHelperDimensions}
          getContainer={() =>
            document.getElementById('component-editor-container') ||
            document.body
          }
          helperClass="accordion-item--dragged"
          items={items}
          lockAxis="y"
          lockToContainerEdges
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          onSortEnd={this.handleSortEnd}
          onSortStart={this.handleSortStart}
          openedItem={openedItem}
          schema={schema}
          sorting={sorting}
          updateBeforeSortStart={this.handleUpdateBeforeSortStart}
          useDragHandle
        />
        <div className="pt4">
          {canAdd && (
            <ButtonWithIcon
              icon={<AddIcon />}
              onClick={this.handleAddItem}
              size="small"
              variation="secondary"
            >
              <FormattedMessage id="admin/pages.editor.components.arrayTemplate.button.add" />
            </ButtonWithIcon>
          )}
        </div>
      </Fragment>
    )
  }

  private handleOpen = (index: number) => (e: React.MouseEvent | unknown) => {
    if (e instanceof Event) {
      e.stopPropagation()
    }

    this.setState(state => ({
      ...state,
      openedItems: state.openedItems.concat(index),
    }))
  }

  private handleUpdateBeforeSortStart = () => {
    return new Promise(resolve => {
      this.setState(
        {
          openedItems: [],
        },
        () => {
          resolve()
        }
      )
    })
  }

  private handleClose = (index: number) => () => {
    this.setState(state => ({
      ...state,
      openedItems: state.openedItems.filter(id => id !== index),
    }))
  }

  private handleSortStart = () => {
    this.setState({
      sorting: true,
    })
  }

  private handleSortEnd: SortableContainerProps['onSortEnd'] = (
    { oldIndex, newIndex },
    e
  ) => {
    const { items } = this.props
    const { onReorderClick } = items[oldIndex]

    onReorderClick(oldIndex, newIndex)(e)

    this.setState({
      sorting: false,
    })
  }

  private handleAddItem = (e: Event) => {
    const { onAddClick, items } = this.props

    onAddClick(e)
    this.setState({
      openedItems: this.state.openedItems.concat(items.length),
    })
  }
}

const StatelessArrayFieldTemplate: React.FunctionComponent<
  ArrayFieldTemplateProps
> = props => <ArrayFieldTemplate {...props} />

export default StatelessArrayFieldTemplate
