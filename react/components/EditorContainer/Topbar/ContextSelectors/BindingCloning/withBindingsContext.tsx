import React, { FunctionComponent, ReactNode } from 'react'
import { compose, graphql, RefetchQueriesProviderFn } from 'react-apollo'
import GetRouteQuery from '../graphql/GetRoute.graphql'
import { BindingSelectorItem, useBindingSelectorReducer } from './BindingSelector'
import SaveRouteMutation from '../graphql/SaveRoute.graphql'
import CopyBindingsMutation from '../graphql/CopyBindings.graphql'
import { Binding } from '../typings'

const withBindingsQueries = compose(
  graphql(GetRouteQuery, {
    name: "routeInfoQuery",
    options: ({ routeId } : { routeId: string }) => ({
      notifyOnNetworkStatusChange: true,
      variables: { routeId }
    }),
  }),
  graphql(SaveRouteMutation, { name: "saveRoute" }),
  graphql(CopyBindingsMutation, { name: "copyBindings" })
)

// TODO: use the proper React context API
// It was kept this way due to a bug that was
// introduced when switching to the Context API,
// which caused the modal to blink.
const BindingsContext = withBindingsQueries(({
  bindings,
  routeInfoQuery,
  currentBinding,
  children,
  ...props
} : {
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
})

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
  refetch: RefetchQueriesProviderFn,
  children: (...args: any) => ReactNode
}) => {
  const formattedBindings = bindings.map((binding: any) => ({
    label: binding.canonicalBaseAddress,
    id: binding.id,
    supportedLocales: binding.supportedLocales,
    checked: false,
    overwrites: false,
    isCurrent: currentBinding.id === binding.id,
  }))

  // Mark items as conflicting or not--that is, if saving on a
  // binding will overwrite a page present there or not
  const formattedState = formattedBindings.map((item: any) => {
    if (item.isCurrent) {
      return item
    }

    // If the page has undefined binding, it is present on all bindings
    if (!routeInfo.binding) {
      return {
        ...item,
        overwrites: true,
      }
    }

    if (!routeInfo.conflicts) {
      return item
    }

    if (routeInfo.conflicts.find(
      (conflict: any) => item.id === conflict.binding)
    ) {
      return {
        ...item,
        overwrites: true,
      }
    }

    return item
  })

  const [state, dispatch] = useBindingSelectorReducer(formattedState)

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

// re. the dangling comma after T https://stackoverflow.com/a/56989122
const withBindingsData = <T,>(Component: FunctionComponent<T>) => ({
  bindings,
  iframeRuntime,
  currentBinding,
  ...props
} : {
  bindings: Binding[]
  currentBinding: Binding
  iframeRuntime: RenderContext
} &
  Omit<T, keyof BindingsContext>) => {
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

export { withBindingsData as withBindingsContext }
