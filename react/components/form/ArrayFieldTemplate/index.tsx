import React, { Component, Fragment } from 'react'
import {
  injectIntl,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import {
  Dimensions,
  SortableContainerProps,
  SortStart,
} from 'react-sortable-hoc'

import AddButton from './AddButton'
import ArrayList from './ArrayList'
import styles from './styles.css'
import { ItemEditStyles } from './ItemForm'

interface ConfigProps {
  itemEditStyle?: ItemEditStyles
  itemTitleKey?: string
}

interface State {
  sorting?: boolean
  openItem: number | null
}

function getHelperDimensions({ node }: SortStart): Dimensions {
  const label = node.querySelector(
    `.${styles['accordion-label']}`
  ) as HTMLElement
  const width = node instanceof HTMLElement ? node.offsetWidth : 0

  return {
    height: label && label.offsetHeight,
    width,
  }
}

type Props = ArrayFieldTemplateProps & ComponentWithIntlProps & ConfigProps
export type OverloadbleProps = ArrayFieldTemplateProps & ConfigProps

class ArrayFieldTemplate extends Component<Props, State> {
  private stackDepth: number

  public constructor(props: Props) {
    super(props)

    this.state = {
      openItem: null,
    }

    this.stackDepth =
      (this.props.formContext.componentFormState &&
        this.props.formContext.componentFormState.depth) ||
      0
  }

  public render() {
    const { canAdd, intl, items, schema, title, itemEditStyle, itemTitleKey } = this.props
    const { openItem, sorting } = this.state

    return (
      <Fragment>
        {!openItem && title && (
          <h4 className="mb4 mt0">{intl.formatMessage({ id: title })}</h4>
        )}
        <ArrayList
          formContext={this.props.formContext}
          getHelperDimensions={getHelperDimensions}
          getContainer={this.getContainer}
          helperClass={styles['accordion-item--dragged']}
          items={items}
          lockAxis="y"
          lockToContainerEdges
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          onSortEnd={this.handleSortEnd}
          onSortStart={this.handleSortStart}
          openItem={openItem}
          stackDepth={this.stackDepth}
          schema={schema}
          sorting={sorting}
          useDragHandle
          itemEditStyle={itemEditStyle}
          itemTitleKey={itemTitleKey}
        >
          {canAdd ? <AddButton onClick={this.handleAddItem} /> : null}
        </ArrayList>
      </Fragment>
    )
  }

  private getContainer() {
    return (
      document.getElementById('component-editor-container') || document.body
    )
  }

  private handleOpen = (index: number) => (e: React.MouseEvent | unknown) => {
    if (e instanceof Event) {
      e.stopPropagation()
    }

    if (typeof this.props.formContext.pushComponentFormState === 'function') {
      this.props.formContext.pushComponentFormState({
        onClose: this.handleClose,
        title: this.props.intl.formatMessage({ id: this.props.title }),
      })
    }

    this.setState(state => ({
      ...state,
      openItem: index,
    }))
  }

  private handleClose = () => {
    if (typeof this.props.formContext.popComponentFormState === 'function') {
      this.props.formContext.popComponentFormState()
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

    if (typeof this.props.formContext.pushComponentFormState === 'function') {
      this.props.formContext.pushComponentFormState({
        onClose: this.handleClose,
        title: this.props.intl.formatMessage({ id: this.props.title }),
      })
    }
  }
}

const ArrayFieldTemplateWithIntl = injectIntl(ArrayFieldTemplate)

const StatelessArrayFieldTemplate: React.FunctionComponent<OverloadbleProps> = props => {
  return <ArrayFieldTemplateWithIntl {...props} />
}

export default StatelessArrayFieldTemplate
