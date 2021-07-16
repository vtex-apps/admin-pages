import React from 'react'
import { WithApolloClient, withApollo } from 'react-apollo'
import { useIntl } from 'react-intl'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import { useEditorContext } from '../../../EditorContext'
import BindingSelector from './BindingSelector'
import TenantInfoQuery from './graphql/TenantInfo.graphql'
import LocaleSelector from './LocaleSelector'
import { QueryStateReducer, TenantInfoData } from './typings'
import { useBinding } from './hooks/useBinding'
import BindingCloning from './BindingCloning'

interface Props {
  iframeRuntime: RenderContext
  showToast: ToastConsumerFunctions['showToast']
}

const ContextSelectors: React.FC<WithApolloClient<Props>> = ({
  client,
  iframeRuntime,
  showToast,
}) => {
  const [queryState, setQueryState] = React.useReducer<QueryStateReducer>(
    (prevState, state) => ({
      ...prevState,
      ...state,
    }),
    { data: undefined, hasError: false, isLoading: true }
  )

  const { binding: iframeBinding, query } = iframeRuntime
  const explicitBinding = Boolean(query?.__bindingAddress)
  const [binding, setBinding] = useBinding()
  const intl = useIntl()

  React.useEffect(() => {
    if (iframeBinding || explicitBinding) {
      const fetchBindings = async () => {
        let data, hasError

        try {
          const result = await client.query<TenantInfoData>({
            fetchPolicy: 'network-only',
            query: TenantInfoQuery,
          })

          data = result.data
          hasError = !!result.errors

          setBinding(
            iframeBinding &&
              data.tenantInfo.bindings &&
              data.tenantInfo.bindings.find(
                item => item.id === iframeBinding.id
              )
          )
        } catch {
          hasError = true

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage({
              defaultMessage:
                'The list of available bindings could not be loaded.',
              id: 'admin/pages.editor.topbar.context.binding.error',
            }),
          })
        } finally {
          setQueryState({ data, hasError, isLoading: false })
        }
      }

      fetchBindings()
    }
  }, [client, explicitBinding, setBinding, iframeBinding, intl, showToast])

  const bindings = React.useMemo(
    () =>
      queryState.data &&
      queryState.data.tenantInfo.bindings &&
      queryState.data.tenantInfo.bindings.filter(
        item => item.targetProduct === 'vtex-storefront'
      ),
    [queryState.data]
  )

  const editor = useEditorContext()

  const handleBindingChange = React.useCallback<
    React.ChangeEventHandler<HTMLSelectElement>
  >(
    ({ target: { value } }) => {
      if (bindings) {
        const newBinding = bindings.find(binding => binding.id === value)

        if (newBinding && editor.iframeWindow) {
          setBinding(newBinding)

          editor.iframeWindow.location.search = `__bindingAddress=${newBinding.canonicalBaseAddress}&__siteEditor=true`
        }

        editor.setMode('disabled')
      }
    },
    [bindings, setBinding, editor.iframeWindow]
  )

  const bindingOptions = React.useMemo(
    () =>
      bindings
        ? bindings.map(binding => ({
            label: binding.canonicalBaseAddress,
            value: binding.id,
          }))
        : [],
    [bindings]
  )

  const localeOptions = React.useMemo(
    () =>
      binding
        ? binding.supportedLocales.map(locale => ({
            label:
              intl.formatMessage({
                id: `admin/pages.editor.locale.${locale.split('-')[0]}`,
              }) + ` (${locale})`,
            value: locale,
          }))
        : editor.availableCultures,
    [binding, editor.availableCultures, intl]
  )

  const shouldShowBindingSelector = !!(
    (iframeBinding || explicitBinding) &&
    bindings &&
    bindings.length > 1 &&
    !queryState.hasError
  )

  return (
    <>
      {shouldShowBindingSelector && (
        <BindingSelector
          isDisabled={queryState.isLoading || !!editor.editTreePath}
          onChange={handleBindingChange}
          options={bindingOptions}
          value={binding ? binding.id : ''}
        />
      )}

      <LocaleSelector
        className={
          shouldShowBindingSelector
            ? 'locale-selector-with-bindings'
            : undefined
        }
        iframeRuntime={iframeRuntime}
        isDisabled={!!editor.editTreePath}
        options={localeOptions}
      />
      {shouldShowBindingSelector && bindings && binding && (
        <BindingCloning
          bindings={bindings}
          binding={binding}
          iframeRuntime={iframeRuntime}
        />
      )}
    </>
  )
}

export default withApollo(ContextSelectors)
