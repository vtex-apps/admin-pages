import debounce from 'lodash.debounce'
import React, { Component, Fragment } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { EXPERIMENTAL_Select } from 'vtex.styleguide'

import { Option, State } from '../../typings/typings'
import { formatOptions } from '../../utils/utils'
import Departments from './queries/Departments.graphql'
import { Data, Department } from './types/typings'

class DepartmentSelector extends Component<
  WidgetProps & ReactIntl.InjectedIntlProps,
  State<Data>
> {
  constructor(props: WidgetProps & ReactIntl.InjectedIntlProps) {
    super(props)

    this.state = {
      data: { departmentSearch: [] } as Data,
      errors: null,
      loading: false,
      value: this.props.value,
    }
  }

  public render() {
    const {
      schema: { title, default: defaultValue },
    } = this.props

    const { errors, loading, data } = this.state

    const FieldTitle = () =>
      title ? (
        <FormattedMessage id={title}>
          {text => <span className="w-100 db mb3">{text}</span>}
        </FormattedMessage>
      ) : null

    return (
      <Fragment>
        <FieldTitle />
        <ApolloConsumer>
          {client => {
            if (errors) {
              console.log(errors)
              return <p> Error! </p>
            }

            return (
              <EXPERIMENTAL_Select
                multi={false}
                options={
                  data && data.departmentSearch
                    ? formatOptions(data.departmentSearch)
                    : []
                }
                onChange={(option: Option) => {
                  const value = option ? option.value : defaultValue
                  this.setState({
                    value,
                  })
                  this.props.onChange(value)
                }}
                loading={loading}
                onSearchInputChange={debounce(async input => {
                  if (
                    input.length >=
                    2 /* magic number: min. number of letters needed to search */
                  ) {
                    const {
                      data: newData,
                      errors: newErrors,
                      loading: newLoading,
                    } = await client.query<{ departmentSearch: Department[] }>({
                      query: Departments,
                      variables: {
                        query: input,
                      },
                    })
                    this.setState({
                      data: newData,
                      errors: newErrors,
                      loading: newLoading,
                    })
                  } else {
                    this.setState({
                      data: { departmentSearch: [] as Department[] },
                      loading: false,
                    })
                  }
                }, 300 /* magic number: debounce time */)}
                noOptionsMessage={({
                  inputValue: input,
                }: {
                  inputValue: string
                }) =>
                  input && input.length > 1
                    ? 'No options found'
                    : 'Type at least two letters'
                }
              />
            )
          }}
        </ApolloConsumer>
      </Fragment>
    )
  }
}

export default injectIntl(DepartmentSelector)
