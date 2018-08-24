import React, { Component, Fragment } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, EmptyState, Table } from 'vtex.styleguide'

interface CustomProps {
  onCreate: () => void
  onSelect: (event: { rowData: Redirect }) => void
  redirects: Redirect[]
  totalItems: number
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

class RedirectsList extends Component<Props> {
  private schema: {
    defaultSchema: {
      items: Redirect[]
      properties: object
    }
  }

  constructor(props: Props) {
    super(props)

    this.schema = this.getSchema(props.redirects)
  }

  public render() {
    const { intl, onCreate, onSelect } = this.props

    const schema = this.schema.defaultSchema
    const items = schema.items

    if (items.length === 0) {
      return (
        <EmptyState
          title={intl.formatMessage({ id: 'pages.admin.redirects.emptyState' })}
        >
          <div className="pt5">
            <Button onClick={onCreate} size="small" variation="primary">
              <FormattedMessage id="pages.admin.redirects.button.create" />
            </Button>
          </div>
        </EmptyState>
      )
    }

    return (
      <Fragment>
        <div className="flex justify-end mb4">
          <Button onClick={onCreate} size="small" variation="primary">
            <FormattedMessage id="pages.admin.redirects.button.create" />
          </Button>
        </div>
        <div className="pointer">
          <Table items={items} onRowClick={onSelect} schema={schema} />
        </div>
      </Fragment>
    )
  }

  private getSchema(redirects: Redirect[]) {
    const { intl } = this.props

    return {
      defaultSchema: {
        items: redirects,
        properties: {
          from: {
            title: intl.formatMessage({
              id: 'pages.admin.redirects.table.from',
            }),
            type: 'string',
          },
          to: {
            title: intl.formatMessage({
              id: 'pages.admin.redirects.table.to',
            }),
            type: 'string',
          },
        },
      },
      type: 'object',
    }
  }
}

export default injectIntl(RedirectsList)
