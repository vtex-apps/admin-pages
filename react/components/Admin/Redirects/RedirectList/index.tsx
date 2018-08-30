import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'render'
import { Badge, EmptyState, Table } from 'vtex.styleguide'

import Redirects from '../../../../queries/Redirects.graphql'
import { getFormattedLocalizedDate } from '../../../../utils/date'

import CreateButton from './CreateButton'

interface CustomProps {
  redirectsQuery: {
    loading: boolean
    redirects?: {
      redirects: Redirect[]
      total: number
    }
  }
}

type Props = CustomProps & ReactIntl.InjectedIntlProps & RenderContextProps

interface State {
  schema?: {
    defaultSchema: {
      items: Redirect[]
      properties: object
    }
  }
}

const BASE_URL = '/admin/cms/redirects'

const REDIRECTS_FROM = 0
const REDIRECTS_TO = 999

class RedirectList extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      schema: undefined,
    }
  }

  public componentDidMount() {
    this.handleLoading()

    this.handleStateSchema()
  }

  public componentDidUpdate() {
    this.handleLoading()

    this.handleStateSchema()
  }

  public render() {
    const { intl } = this.props

    if (!this.state.schema) {
      return (
        <div className="w-80 mw9 mv6 ph6 mr-auto ml-auto">
          <FormattedMessage id="pages.admin.loading">
            {text => (
              <span>
                {text}
                &hellip;
              </span>
            )}
          </FormattedMessage>
        </div>
      )
    }

    const schema = this.state.schema.defaultSchema
    const items = schema.items

    return (
      <div className="w-80 mw9 mv6 ph6 mr-auto ml-auto">
        {items.length === 0 ? (
          <EmptyState
            title={intl.formatMessage({
              id: 'pages.admin.redirects.emptyState',
            })}
          >
            <div className="pt5">
              <CreateButton onClick={this.openNewRedirect} />
            </div>
          </EmptyState>
        ) : (
          <Fragment>
            <div className="flex justify-end mb4">
              <CreateButton onClick={this.openNewRedirect} />
            </div>
            <div className="pointer">
              <Table
                items={items}
                onRowClick={this.viewRedirect}
                schema={schema}
              />
            </div>
          </Fragment>
        )}
      </div>
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
          disabled: {
            cellRenderer: (cell: { cellData: boolean }) => (
              <div className="ph4">
                <Badge type={cell.cellData ? 'error' : 'success'}>
                  {intl.formatMessage({
                    id: cell.cellData
                      ? 'pages.admin.redirects.table.status.inactive'
                      : 'pages.admin.redirects.table.status.active',
                  })}
                </Badge>
              </div>
            ),
            title: intl.formatMessage({
              id: 'pages.admin.redirects.table.status.title',
            }),
            type: 'boolean',
          },
          // tslint:enable:object-literal-sort-keys
        },
      },
      type: 'object',
    }
  }

  private handleLoading = () => {
    if (this.props.redirectsQuery.loading) {
      this.context.startLoading()
    } else {
      this.context.stopLoading()
    }
  }

  private handleStateSchema = () => {
    const { locale } = this.context.culture
    const {
      redirectsQuery: { redirects: redirectsData },
    } = this.props
    const { schema } = this.state

    if (redirectsData && !schema) {
      this.setState({
        schema: this.getSchema(redirectsData.redirects, locale),
      })
    }
  }

  private openNewRedirect = () => {
    const { navigate } = this.props.runtime

    navigate({ to: `${BASE_URL}/new` })
  }

  private viewRedirect = (event: { rowData: Redirect }) => {
    const { navigate } = this.props.runtime

    const selectedRedirect = event.rowData

    navigate({ to: `${BASE_URL}/${selectedRedirect.id}` })
  }
}

export default compose(
  graphql(Redirects, {
    name: 'redirectsQuery',
    options: {
      variables: {
        from: REDIRECTS_FROM,
        to: REDIRECTS_TO,
      },
    },
  }),
  injectIntl,
  withRuntimeContext,
)(RedirectList)
