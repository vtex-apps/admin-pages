import debounce from 'lodash.debounce'
import { InjectedIntl } from 'react-intl'

import {
  CatalogEntity,
  Option,
  SearchInputChangeHandlerGetterArgs,
} from './typings'

export const formatOption = (value: CatalogEntity): Option => ({
  label: value.name,
  value: value.id,
})

export const formatOptions = (values: CatalogEntity[]): Option[] =>
  values.map(formatOption)

export const getMessage = (
  id: 'minimum' | 'options' | 'placeholder',
  intl: InjectedIntl
) =>
  intl.formatMessage({
    id: `pages.editor.components.configurations.selector.${id}`,
  })

export const getSearchInputChangeHandler = ({
  client,
  query,
  setState,
}: SearchInputChangeHandlerGetterArgs) =>
  debounce(async (searchInput: string) => {
    if (searchInput.length > 1) {
      setState({ isLoading: true })

      try {
        const { data } = await client.query({
          query,
          variables: {
            query: searchInput,
          },
        })

        setState({
          data,
          isLoading: false,
        })
      } catch (err) {
        setState({
          hasError: true,
          isLoading: false,
        })
      }
    }
  }, 300)
