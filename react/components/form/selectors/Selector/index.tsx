import { DocumentNode } from 'graphql'
import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import { EXPERIMENTAL_Select } from 'vtex.styleguide'

import FieldTitle from '../../FieldTitle'

import { useInitializer } from './hooks'
import { CatalogEntity, EntityData, Input, NativeType, Option } from './typings'
import {
  formatOption,
  formatOptions,
  getMessage,
  getSearchInputChangeHandler,
} from './utils'

interface CustomProps {
  entity: CatalogEntity
  initialQuery: DocumentNode
  initialValue: NativeType['id']
  onChange: WidgetProps['onChange']
  query: DocumentNode
  schema: WidgetProps['schema']
}

type Props = CustomProps &
  ReactIntl.InjectedIntlProps &
  WithApolloClient<object>

interface State {
  data?: EntityData
  hasError: boolean
  isLoading: boolean
  value?: Option
}

const Selector: React.FunctionComponent<Props> = ({
  client,
  entity,
  initialQuery,
  initialValue,
  intl,
  onChange,
  query,
  schema: { default: defaultValue, title },
}) => {
  const { initialData, isInitialDataLoading } = useInitializer({
    client,
    id: initialValue,
    query: initialQuery,
  })

  const [state, setState] = React.useReducer(
    (prevState: State, newState: Partial<State>) => ({
      ...prevState,
      ...newState,
    }),
    {
      hasError: false,
      isLoading: false,
      value: initialData && formatOption(initialData),
    }
  )

  React.useEffect(
    () => {
      setState({ value: initialData && formatOption(initialData) })
    },
    [isInitialDataLoading]
  )

  const handleInputChange = (option: Option) => {
    const newValue = option ? option.value : (defaultValue as string)

    onChange(newValue)

    setState({ value: option })
  }

  const handleSearchInputChange = getSearchInputChangeHandler({
    client,
    query,
    setState,
  })

  return (
    <>
      <FieldTitle title={title} />

      <EXPERIMENTAL_Select
        disabled={isInitialDataLoading}
        loading={isInitialDataLoading || state.isLoading}
        multi={false}
        noOptionsMessage={({ inputValue }: Input) =>
          inputValue && inputValue.length > 1
            ? getMessage('options', intl)
            : getMessage('minimum', intl)
        }
        onChange={handleInputChange}
        onSearchInputChange={handleSearchInputChange}
        options={
          state.data && state.data[`${entity}Search`]
            ? formatOptions(state.data[`${entity}Search`])
            : []
        }
        placeholder={getMessage('placeholder', intl)}
        value={state.value}
      />
    </>
  )
}

export default injectIntl(withApollo(Selector))
