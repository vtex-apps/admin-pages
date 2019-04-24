import { useEffect, useReducer } from 'react'

import { InitializerArgs, InitializerState } from './typings'

export const useInitializer = ({ client, id, query }: InitializerArgs) => {
  const shouldFetchData = !!id

  const [state, setState] = useReducer(
    (prevState: InitializerState, newState: Partial<InitializerState>) => ({
      ...prevState,
      ...newState,
    }),
    {
      isLoading: shouldFetchData,
    }
  )

  const fetchData = async () => {
    try {
      const result = await client.query({
        query,
        variables: {
          id,
        },
      })

      setState({ data: result.data.category, isLoading: false })
    } catch (err) {
      setState({ isLoading: false })
    }
  }

  useEffect(() => {
    if (shouldFetchData) {
      fetchData()
    }
  }, [])

  return { initialData: state.data, isInitialDataLoading: state.isLoading }
}
