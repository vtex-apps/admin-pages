import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, EmptyState, Table } from 'vtex.styleguide'

import { getFormattedLocalizedDate } from '../../../utils/date'

interface CustomProps {
  onCreate: () => void
  onSelect: (event: { rowData: Redirect }) => void
  redirects: Redirect[]
  totalItems: number
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

class RedirectsList extends Component<Props> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
  }

  private schema: {
    defaultSchema: {
      items: Redirect[]
      properties: object
    }
  }

  constructor(props: Props, context: RenderContext) {
    super(props)

    this.schema = this.getSchema(props.redirects, context.culture.locale)
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

  private getSchema = (redirects: Redirect[], locale: string) => {
    const { intl } = this.props

    return {
      defaultSchema: {
        items: redirects,
        properties: {
          // tslint:disable:object-literal-sort-keys
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
          endDate: {
            cellRenderer: (cell: { cellData: string }) =>
              cell.cellData ? (
                <span className="ph4">
                  {getFormattedLocalizedDate(cell.cellData, locale)}
                </span>
              ) : (
                <FormattedMessage id="pages.admin.redirects.table.endDate.default">
                  {text => <span className="ph4 silver">{text}</span>}
                </FormattedMessage>
              ),
            title: intl.formatMessage({
              id: 'pages.admin.redirects.table.endDate.title',
            }),
            type: 'string',
          },
          // tslint:enable:object-literal-sort-keys
        },
      },
      type: 'object',
    }
  }
}

export default injectIntl(RedirectsList)
