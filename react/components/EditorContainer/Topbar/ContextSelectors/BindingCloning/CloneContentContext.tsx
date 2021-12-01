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
    ) => Promise<ApolloQueryResult<Route>>
    dispatchBindingSelector: Dispatch<BindingSelectorAction>
    saveRoute: (
      args: MutationArgs<SaveRouteVariables>
    ) => Promise<QueryResult<unknown>>
    copyBindings: (
      args: MutationArgs<CopyBindingVariables>
    ) => Promise<QueryResult<unknown>>
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
  saveRoute: (
    args: MutationArgs<SaveRouteVariables>
  ) => Promise<QueryResult<unknown>>
  copyBindings: (
    args: MutationArgs<CopyBindingVariables>
  ) => Promise<QueryResult<unknown>>
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

  /**
   * This check currentBinding.id !== iframeBinding?.id is needed to avoid the blinking
   * in the modal when user changes the binding.
   * The blinking is happening because there is a race condition on ContextSelectors/index.ts
   * When handleBindingChange is called, it sets the target binding as binding in the state.
   * However, when the useEffect in that file runs next time, it sets bindings to the old one,
   * coming from iframeBinding, which seems to be beeing update afterwards. Then, when iframeBinding
   * updates, the setBinding is called called, now with the target binding causing the blinking.
   */
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
