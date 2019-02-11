import debounce from 'lodash.debounce'
import React, { Component, Fragment } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { EXPERIMENTAL_Select } from 'vtex.styleguide'

import { WidgetProps } from 'react-jsonschema-form'
import Brands from '../../../queries/Brands.graphql'


interface Option {
  label: string
  value: any
}

interface Brand {
  name: string
  id: string
}

interface Data {
  brandSearch: Brand[]
}

interface State {
  data: Data
  errors: any
  loading: boolean
  value: any
}

interface CustomProps {
  value: any
}

class BrandSelector extends Component<WidgetProps, State> {
  constructor(props: WidgetProps) {
    super(props)

    this.state = {
      data: { brandSearch: [] } as Data,
      errors: null,
      loading: false,
      value: this.props.value,
    }
  }

  public render() {
    const {
      schema: { title }
    } = this.props

    const {
      errors,
      loading,
      data
    } = this.state

    const FieldTitle = () => title ? (
      <FormattedMessage id={title}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>
    ) : null

    return (
      <Fragment>
        <FieldTitle/>
        <ApolloConsumer>
          {
          (client) => {

            if(errors) {
              console.log(errors)
              return (<p> Error! </p>)
            }
            if(data) {
              console.log(data)
            }
            return (
              <EXPERIMENTAL_Select
                multi = { false }

                options = {
                  (data && data.brandSearch) ?
                  data.brandSearch.map(
                    brand => ({
                      label: brand.name,
                      value: brand
                    })
                  ) : []
                }

                onChange = {
                  (option: Option) => {
                    if (option) {
                      const { value } = option

                      this.setState({
                        value
                      })
                      this.props.onChange(value)
                    }
                  }
                }

                loading = { loading }

                onSearchInputChange = {
                  debounce(async (input) => {
                    if (input.length >= 2 /* magic number: min. number of letters needed to search */) {
                      const {
                        data: newData,
                        errors: newErrors,
                        loading: newLoading,
                      } = await client.query<{brandSearch: Brand[]}>({
                        query: Brands,
                        variables: {
                          query: input
                        }
                      })
                      this.setState({
                        data: newData,
                        errors: newErrors,
                        loading: newLoading,
                      })
                    } else {
                      this.setState({
                        data: { brandSearch: [] as Brand[] },
                        loading: true,
                      })
                    }
                  }, 300 /* magic number: debounce time */ )
                }

                loadingMessage = {
                  'Write at least two letters' /* this is not showing up in the application, investigate */
                }
              />
            )
          }
          }
        </ApolloConsumer>
      </Fragment>
    )
  }
}

export default BrandSelector
