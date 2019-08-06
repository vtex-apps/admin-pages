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
  openedItem: number | null
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
      openedItem: null,
    }
  }

  public render() {
    const { canAdd, items, schema, title } = this.props
    const { openedItem, sorting } = this.state

    return (
      <Fragment>
        {title && <SimpleFormattedMessage id={title} />}
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

  private handleOpen = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation()

    this.setState({
      openedItem: index,
    })
  }

  private handleClose = () => {
    this.setState({
      openedItem: -1,
    })
  }

  private handleSortStart = () => {
    this.setState({
      openedItem: -1,
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
      openedItem: items.length,
    })
  }
}

const StatelessArrayFieldTemplate: React.FunctionComponent<
  ArrayFieldTemplateProps
> = props => <ArrayFieldTemplate {...props} />

export default StatelessArrayFieldTemplate
