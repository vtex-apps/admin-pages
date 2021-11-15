import React, {
  FunctionComponent,
  FC,
  ReactNode,
  createContext,
  useContext,
} from 'react'
import { compose, graphql, RefetchQueriesProviderFn } from 'react-apollo'
// import { useQuery } from '@apollo/react-hooks'

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
  graphql(GetRouteQuery, {
    name: 'routeInfoQuery',
    options: ({ routeId }: { routeId: string }) => ({
      notifyOnNetworkStatusChange: true,
      variables: { routeId },
    }),
  }),
  graphql(SaveRouteMutation, { name: 'saveRoute' }),
  graphql(CopyBindingsMutation, { name: 'copyBindings' })
)

const CloneContentContext = createContext({})

const CloneContentProvider: FC = ({ children }) => {
  return (
    <CloneContentContext.Provider value={{}}>
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
  refetch,
  ...props
}: {
  bindings: Binding[]
  currentBinding: Binding
  routeInfo: Route
  refetch: RefetchQueriesProviderFn
  children: (...args: any) => ReactNode
}) => {
  const initialState = bindings.map(binding =>
    createInitialCloningState(binding, currentBinding, routeInfo)
  )

  const [state, dispatch] = useBindingSelectorReducer(initialState)

  return children({
    state,
    dispatch,
    refetch,
    currentBinding,
    routeInfo,
    ...props,
  })
}

interface BindingsContext {
  saveRoute: () => any
  copyBindings: () => any
  refetch: () => any
  dispatch: () => any
  routeInfo: Route
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
    const { loading, error, route, refetch } = routeInfoQuery

    if (loading) {
      return children({ loading: true })
    }

    if (error || !route) {
      return children({ error: error ?? {} })
    }

    return BindingFormatter({
      children,
      bindings,
      currentBinding,
      routeInfo: route,
      refetch,
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

const ProviderWithQueries = withBindingsQueries(CloneContentProvider)

export {
  withBindingsData as withBindingsContext,
  ProviderWithQueries as CloneContentProvider,
  useCloneContent,
}
