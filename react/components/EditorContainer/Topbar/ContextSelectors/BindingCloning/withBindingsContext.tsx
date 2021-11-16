import React, {
  FunctionComponent,
  FC,
  ReactNode,
  createContext,
  useContext,
} from 'react'
import { compose, graphql, QueryResult } from 'react-apollo'
import {
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
} from 'apollo-client'

import GetRouteQuery from '../graphql/GetRoute.graphql'
import {
  BindingSelectorItem,
  useBindingSelectorReducer,
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

// type TODO = any
interface CloneContentContextValue {
  data: {
    loading: boolean
    error?: ApolloError
    routeInfo?: Route
  }
  actions: {
    refetchRouteInfo: (
      variables?: OperationVariables
    ) => Promise<ApolloQueryResult<any>>
  }
}

const CloneContentContext = createContext<CloneContentContextValue>(
  {} as CloneContentContextValue
)

interface WithBindingsQueriesProps {
  routeInfoQuery: QueryResult & { route?: Route }
}

interface CloneContentProps {
  routeId: string
}

const CloneContentProvider: FC<CloneContentProps &
  WithBindingsQueriesProps> = ({ children, routeInfoQuery }) => {
  const {
    route: routeInfo,
    loading,
    error,
    refetch: refetchRouteInfo,
  } = routeInfoQuery
  return (
    <CloneContentContext.Provider
      value={{
        data: { loading, error, routeInfo },
        actions: { refetchRouteInfo },
      }}
    >
      {children}
    </CloneContentContext.Provider>
  )
}

const useCloneContent = () => useContext(CloneContentContext)

// TODO: use the proper React context API
// It was kept this way due to a bug that was
// introduced when switching to the Context API,
// which caused the modal to blink.
const BindingFormatter = ({
  children,
  bindings,
  currentBinding,
  routeInfo,
  ...props
}: {
  bindings: Binding[]
  currentBinding: Binding
  routeInfo: Route
  children: (...args: any) => ReactNode
}) => {
  const initialState = bindings.map(binding =>
    createInitialCloningState(binding, currentBinding, routeInfo)
  )

  const [state, dispatch] = useBindingSelectorReducer(initialState)

  return children({
    state,
    dispatch,
    currentBinding,
    routeInfo,
    ...props,
  })
}

interface BindingsContext {
  saveRoute: () => any
  copyBindings: () => any
  dispatch: () => any
  state: BindingSelectorItem[]
  pageContext: PageContext
}

// TODO: use the proper React context API
// It was kept this way due to a bug that was
// introduced when switching to the Context API,
// which caused the modal to blink.
const BindingsContext = withBindingsQueries(
  ({
    bindings,
    routeInfoQuery,
    currentBinding,
    children,
    ...props
  }: {
    bindings: Binding[]
    routeInfoQuery: any
    currentBinding: Binding
    children: (...args: any) => ReactNode
  }) => {
    const { route } = routeInfoQuery

    if (!route) return children({ ...props })

    return BindingFormatter({
      children,
      bindings,
      currentBinding,
      routeInfo: route,
      ...props,
    })
  }
)

// re. the dangling comma after T https://stackoverflow.com/a/56989122
const withBindingsData = <T,>(Component: FunctionComponent<T>) => ({
  bindings,
  iframeRuntime,
  currentBinding,
  ...props
}: {
  bindings: Binding[]
  currentBinding: Binding
  iframeRuntime: RenderContext
} & Omit<T, keyof BindingsContext>) => {
  const route = iframeRuntime?.route
  const { id: routeId, pageContext } = route ?? {}

  return (
    <BindingsContext
      currentBinding={currentBinding}
      bindings={bindings}
      routeId={routeId}
      key={routeId}
    >
      {(result: any) => (
        <Component {...{ currentBinding, pageContext, ...result, ...props }} />
      )}
    </BindingsContext>
  )
}

const ProviderWithQueries: FC<CloneContentProps> = withBindingsQueries(
  CloneContentProvider
)

export {
  withBindingsData as withBindingsContext,
  ProviderWithQueries as CloneContentProvider,
  useCloneContent,
}
