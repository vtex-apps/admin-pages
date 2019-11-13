import React from 'react'
import { QueryResult } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { Button, EmptyState, Spinner } from 'vtex.styleguide'

const isRefetching = (status: number): boolean => status === 4

const Loading = (): React.ReactElement => (
  <div className="flex justify-center items-center h5">
    <Spinner />
  </div>
)

interface ErrorMessageProps extends InjectedIntlProps {
  title: string
  description: string
  refetch: () => unknown
  refetching: boolean
}

const ErrorMessageComponent: React.FunctionComponent<ErrorMessageProps> = ({
  intl,
  title,
  description,
  refetch,
  refetching,
}): React.ReactElement => (
  <div className="flex flex-column justify-center">
    <EmptyState
      title={intl.formatMessage({
        id: title,
      })}
    >
      <FormattedMessage id={description} />
    </EmptyState>
    <Button
      size="small"
      variation="tertiary"
      onClick={() => refetch()}
      isLoading={refetching}
    >
      <FormattedMessage id="admin/pages.editor.store.settings.refetch" />
    </Button>
  </div>
)
const ErrorMessage = injectIntl(ErrorMessageComponent)

export function handleCornerCases<TData, TVariables>(
  options: { error: { title: string; description: string } },
  fn: (
    x: Omit<QueryResult<TData, TVariables>, 'loading' | 'error'> & {
      data: TData // be sure data is not undefined
    }
  ) => JSX.Element
) {
  return ({
    loading,
    error,
    data,
    refetch,
    networkStatus,
    ...rest
  }: QueryResult<TData, TVariables>) => {
    if (loading) {
      return <Loading />
    }
    if (error || !data) {
      const { error: errorMessage } = options
      console.error('Error', error)
      return (
        <ErrorMessage
          {...errorMessage}
          refetch={refetch}
          refetching={isRefetching(networkStatus)}
        />
      )
    }

    return fn({ data, refetch, networkStatus, ...rest })
  }
}
