import React, { FunctionComponent, ReactNode } from 'react'
import { compose, graphql, RefetchQueriesProviderFn } from 'react-apollo'
import GetRouteQuery from '../graphql/GetRoute.graphql'
import {
  BindingSelectorItem,
  useBindingSelectorReducer,
} from './BindingSelector'
import SaveRouteMutation from '../graphql/SaveRoute.graphql'
import CopyBindingsMutation from '../graphql/CopyBindings.graphql'
import { Binding, Locale } from '../typings'
import { useIntl } from 'react-intl'

const withBindingsQueries = compose(
  graphql(GetRouteQuery, {
    name: 'routeQuery',
    options: ({ routeId }: { routeId: string }) => ({
      notifyOnNetworkStatusChange: true,
      variables: { routeId },
    }),
  }),
  graphql(SaveRouteMutation, { name: 'saveRoute' }),
  graphql(CopyBindingsMutation, { name: 'copyBindings' })
)

// TODO: use the proper React context API
// It was kept this way due to a bug that was
// introduced when switching to the Context API,
// which caused the modal to blink.
const BindingsContext = withBindingsQueries(
  ({
    bindings,
    routeQuery,
    currentBinding,
    children,
    ...props
  }: {
    bindings: Binding[]
    routeQuery: any
    currentBinding: Binding
    children: (...args: any) => ReactNode
  }) => {
    const { loading, error, route: currentRouteInfo, refetch } = routeQuery

    if (loading) {
      return children({ loading: true })
    }

    if (error || !currentRouteInfo) {
      return children({ error: error ?? {} })
    }

    return BindingFormatter({
      children,
      bindings,
      currentBinding,
      currentRouteInfo,
      refetch,
      ...props,
    })
  }
)

// TODO: use the proper React context API
// It was kept this way due to a bug that was
// introduced when switching to the Context API,
// which caused the modal to blink.
const BindingFormatter = ({
  children,
  bindings,
  currentBinding,
  currentRouteInfo,
  refetch,
  ...props
}: {
  bindings: Binding[]
  currentBinding: Binding
  currentRouteInfo: Route
  refetch: RefetchQueriesProviderFn
  children: (...args: any) => ReactNode
}) => {
  const intl = useIntl()

  const formattedBindings = bindings.map((binding: any) => ({
    label: binding.canonicalBaseAddress,
    id: binding.id,
    supportedLocales: binding.supportedLocales.map((locale: Locale) => {
      return {
        label:
          intl.formatMessage({
            id: `admin/pages.editor.locale.${locale.split('-')[0]}`,
          }) + ` (${locale})`,
        checked: false,
      }
    }),
    checked: false,
    overwritesPage: false,
    overwritesTemplate: false,
    isCurrent: currentBinding.id === binding.id,
  }))

  // Mark items as conflicting or not--that is, if saving on a
  // binding will overwrite a page present there or not
  const formattedState = formattedBindings.map((binding: any) => {
    if (binding.isCurrent) {
      return binding
    }

    // If the page has undefined binding, it is present on all bindings
    if (!currentRouteInfo.binding) {
      return {
        ...binding,
        overwritesPage: true,
      }
    }

    if (!currentRouteInfo.conflicts) {
      return binding
    }

    const currentConflict = currentRouteInfo.conflicts.find(
      (conflict: any) => binding.id === conflict.binding
    )
    if (currentConflict) {
      return {
        ...binding,
        overwritesPage: true,
        overwritesTemplate: currentConflict.blockId !== binding.blockId,
      }
    }

    return binding
  })

  const [state, dispatch] = useBindingSelectorReducer(formattedState)

  return children({
    state,
    dispatch,
    refetch,
    currentBinding,
    currentRouteInfo,
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
      iframeRuntime={iframeRuntime}
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
