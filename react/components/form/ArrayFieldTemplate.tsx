import { JSONSchema6 } from 'json-schema'
import React, { Component, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import {
  Dimensions,
  SortableContainerProps,
  SortStart,
} from 'react-sortable-hoc'
import AddButton from './AddButton'

import ArrayList from './ArrayList'

interface Props extends InjectedIntlProps {
  canAdd: boolean
  items?: ArrayFieldTemplateProps['items']
  onAddClick?: (event: Event) => void
  // TODO: remove this any
  schema: any
}

interface State {
  sorting?: boolean
  openItem: number | null
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
  constructor(props: Props & ArrayFieldTemplateProps) {
    super(props)
    this.state = {
      openItem: null,
    }
  }

  public render() {
    const { canAdd, intl, items, schema, title } = this.props
    const { openItem, sorting } = this.state
    return (
      <Fragment>
        {!openItem && title && (
          <h4 className="mb4 mt0">{intl.formatMessage({ id: title })}</h4>
        )}
        <ArrayList
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
          openItem={openItem}
          pressDelay={200}
          schema={schema}
          sorting={sorting}
          updateBeforeSortStart={this.handleUpdateBeforeSortStart}
          useDragHandle
        >
          {canAdd ? <AddButton onClick={this.handleAddItem} /> : null}
        </ArrayList>
      </Fragment>
    )
  }

  private handleOpen = (index: number) => (e: React.MouseEvent | unknown) => {
    if (e instanceof Event) {
      e.stopPropagation()
    }

    if (typeof this.props.formContext.setComponentFormState === 'function') {
      this.props.formContext.setComponentFormState({
        onClose: this.handleClose(index),
        title: this.props.intl.formatMessage({ id: this.props.title }),
      })
    }

    this.setState(state => ({
      ...state,
      openItem: index,
    }))
  }

  private handleUpdateBeforeSortStart = () => {
    return new Promise(resolve => {
      this.setState(
        {
          openItem: null,
        },
        () => {
          resolve()
        }
      )
    })
  }

  private handleClose = (index: number) => () => {
    if (typeof this.props.formContext.setComponentFormState === 'function') {
      this.props.formContext.setComponentFormState(null)
    }

    this.setState(state => ({
      ...state,
      openItem: null,
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

    if (oldIndex !== newIndex) {
      onReorderClick(oldIndex, newIndex)(e)
    }

    this.setState({
      sorting: false,
    })
  }

  private handleAddItem = (e: Event) => {
    const { onAddClick, items } = this.props

    onAddClick(e)

    this.setState({
      openItem: items.length,
    })

    if (typeof this.props.formContext.setComponentFormState === 'function') {
      this.props.formContext.setComponentFormState({
        onClose: this.handleClose(items.length),
        title: this.props.intl.formatMessage({ id: this.props.title }),
      })
    }
  }
}

const ArrayFieldTemplateWithIntl = injectIntl(ArrayFieldTemplate)

const StatelessArrayFieldTemplate: React.FunctionComponent<
  ArrayFieldTemplateProps
> = props => {
  return <ArrayFieldTemplateWithIntl {...props} />
}

export default StatelessArrayFieldTemplate
