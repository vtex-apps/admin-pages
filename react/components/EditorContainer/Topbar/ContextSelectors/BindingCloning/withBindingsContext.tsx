import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  Dispatch,
} from 'react'
import { compose, graphql, QueryResult } from 'react-apollo'
import {
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
} from 'apollo-client'

import GetRouteQuery from '../graphql/GetRoute.graphql'
import {
  BindingSelectorState,
  setInitialBindingState,
  useBindingSelectorReducer,
  BindingSelectorAction,
} from './BindingSelector'
import SaveRouteMutation from '../graphql/SaveRoute.graphql'
import CopyBindingsMutation from '../graphql/CopyBindings.graphql'
import { Binding } from '../typings'
import { createInitialCloningState } from './utils/initialReducerState'

const withBindingsQueries = compose(
  graphql<{ routeId: string }, {}>(GetRouteQuery, {
    name: 'routeInfoQuery',
    options: ({ routeId }) => ({
      notifyOnNetworkStatusChange: true,
      variables: { routeId },
    }),
  }),
  graphql(SaveRouteMutation, { name: 'saveRoute' }),
  graphql(CopyBindingsMutation, { name: 'copyBindings' })
)

type TODO = any
interface CloneContentContextValue {
  data: {
    loading: boolean
    error?: ApolloError
    routeInfo?: Route
    bindingSelector: BindingSelectorState
    currentBinding: Binding
    pageContext: PageContext
  }
  actions: {
    refetchRouteInfo: (
      variables?: OperationVariables
    ) => Promise<ApolloQueryResult<TODO>>
    dispatchBindingSelector: Dispatch<BindingSelectorAction>
    saveRoute: (args: MutationArgs<SaveRouteVariables>) => void
    copyBindings: (args: MutationArgs<CopyBindingVariables>) => void
  }
}

const CloneContentContext = createContext<CloneContentContextValue>(
  {} as CloneContentContextValue
)

interface SaveRouteVariables {
  route: Route
}

type MutationArgs<T> = {
  variables: T
}

interface CopyBindingVariables {
  from: string
  to: string
  template: string
  context: PageContext
}

interface WithBindingsQueriesProps {
  routeInfoQuery: QueryResult & { route?: Route }
  saveRoute: (args: MutationArgs<SaveRouteVariables>) => void
  copyBindings: (args: MutationArgs<CopyBindingVariables>) => void
}

interface CloneContentProps {
  routeId: string
  bindings: Binding[]
  currentBinding: Binding
  pageContext: PageContext
  iframeBinding: RenderContext['binding']
}

const CloneContentProvider: FC<CloneContentProps &
  WithBindingsQueriesProps> = ({
  children,
  routeInfoQuery,
  bindings,
  currentBinding,
  pageContext,
  saveRoute,
  copyBindings,
  iframeBinding,
}) => {
  const [bindingSelector, dispatchBindingSelector] = useBindingSelectorReducer()
  const {
    route: routeInfo,
    loading: routeInfoLoading,
    error,
    refetch: refetchRouteInfo,
  } = routeInfoQuery

  useEffect(() => {
    if (routeInfo) {
      const initialState = bindings.map(binding =>
        createInitialCloningState(binding, currentBinding, routeInfo)
      )
      dispatchBindingSelector(setInitialBindingState(initialState))
    }
  }, [bindings, currentBinding, dispatchBindingSelector, routeInfo])

  const loading =
    routeInfoLoading ||
    (currentBinding && currentBinding.id !== iframeBinding?.id)

  return (
    <CloneContentContext.Provider
      value={{
        data: {
          loading,
          error,
          routeInfo,
          bindingSelector,
          currentBinding,
          pageContext,
        },
        actions: {
          refetchRouteInfo,
          dispatchBindingSelector,
          saveRoute,
          copyBindings,
        },
      }}
    >
      {children}
    </CloneContentContext.Provider>
  )
}

const useCloneContent = () => useContext(CloneContentContext)

const ProviderWithQueries: FC<CloneContentProps> = withBindingsQueries(
  CloneContentProvider
)

export { ProviderWithQueries as CloneContentProvider, useCloneContent }
