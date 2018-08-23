import React, { Component, Fragment } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, IconDelete, Pagination, Table } from 'vtex.styleguide'

interface CustomProps {
  onCreate: () => void
  onDelete: (event: Event) => void
  onSelect: (event: { rowData: Redirect }) => void
  redirects: Redirect[]
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface State {
  currentItemFrom: number
  currentItemTo: number
}

const CURRENT_ITEM_FROM_DEFAULT = 1
const CURRENT_ITEM_TO_DEFAULT = 10

class RedirectsList extends Component<Props, State> {
  private itemsQty: number
  private pageSchema: {
    defaultSchema: object
    items: Redirect[]
  }

  constructor(props: Props) {
    super(props)

    this.pageSchema = this.getSchema(props.onDelete, props.redirects)
    this.itemsQty = this.pageSchema.items.length

    this.state = {
      currentItemFrom: CURRENT_ITEM_FROM_DEFAULT,
      currentItemTo: CURRENT_ITEM_TO_DEFAULT,
    }
  }

  public render() {
    const { onCreate, onSelect } = this.props

    const currentItemTo =
      this.itemsQty < this.state.currentItemTo
        ? this.itemsQty
        : this.state.currentItemTo

    const selectedItems = this.pageSchema.items.slice(
      this.state.currentItemFrom,
      this.state.currentItemTo,
    )

    return (
      <Fragment>
        <div className="flex justify-end mb4">
          <Button onClick={onCreate} size="small" variation="primary">
            <FormattedMessage id="pages.admin.redirects.newRedirect" />
          </Button>
        </div>
        <Table
          items={selectedItems}
          onRowClick={onSelect}
          schema={this.pageSchema.defaultSchema}
        />
        <Pagination
          currentItemFrom={this.state.currentItemFrom}
          currentItemTo={currentItemTo}
          onNextClick={this.handleNavigationNext}
          onPrevClick={this.handleNavigationPrev}
          textOf="of"
          textShowRows="show rows"
          totalItems={this.itemsQty}
        />
      </Fragment>
    )
  }

  private getSchema(onDelete: (event: Event) => void, redirects: Redirect[]) {
    const { intl } = this.props

    // tslint:disable:object-literal-sort-keys
    return {
      defaultSchema: {
        properties: {
          fromUrl: {
            title: intl.formatMessage({
              id: 'pages.admin.redirects.info.from',
            }),
            type: 'string',
          },
          toUrl: {
            title: intl.formatMessage({ id: 'pages.admin.redirects.info.to' }),
            type: 'string',
          },
          endDate: {
            title: intl.formatMessage({
              id: 'pages.admin.redirects.info.endDate',
            }),
            type: 'string',
          },
          active: {
            default: false,
            title: intl.formatMessage({
              id: 'pages.admin.redirects.info.active',
            }),
            type: 'boolean',
          },
          remove: {
            cellRenderer: () => (
              <div className="mh4">
                <Button variation="danger" size="small" onClick={onDelete}>
                  <IconDelete size={10} color="#fff" />
                </Button>
              </div>
            ),
            title: intl.formatMessage({
              id: 'pages.admin.redirects.button.remove',
            }),
            type: 'object',
          },
        },
        type: 'object',
      },
      items: redirects,
    }
    // tslint:enable:object-literal-sort-keys
  }

  private handleNavigationNext = () => {
    const defaultItemsToPlus =
      this.itemsQty < CURRENT_ITEM_TO_DEFAULT
        ? this.itemsQty
        : CURRENT_ITEM_TO_DEFAULT

    const newCurrentItemTo = this.state.currentItemTo + defaultItemsToPlus

    const currentItemTo =
      newCurrentItemTo > this.itemsQty ? this.itemsQty : newCurrentItemTo

    this.setState({
      currentItemFrom: this.state.currentItemTo,
      currentItemTo,
    })
  }

  private handleNavigationPrev = () => {
    const defaultItemsMinus =
      this.itemsQty < CURRENT_ITEM_TO_DEFAULT
        ? this.itemsQty
        : CURRENT_ITEM_TO_DEFAULT

    const newItemFrom = this.state.currentItemFrom - defaultItemsMinus

    const newItemTo = this.state.currentItemTo - defaultItemsMinus

    const currentItemFrom =
      newItemFrom < CURRENT_ITEM_FROM_DEFAULT
        ? CURRENT_ITEM_FROM_DEFAULT
        : newItemFrom

    const currentItemTo =
      newItemTo < CURRENT_ITEM_TO_DEFAULT ? CURRENT_ITEM_TO_DEFAULT : newItemTo

    this.setState({ currentItemFrom, currentItemTo })
  }
}

export default injectIntl(RedirectsList)
