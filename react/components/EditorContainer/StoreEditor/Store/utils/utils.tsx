import React from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { Button, EmptyState, Spinner } from 'vtex.styleguide'

const isRefetching = (status: number): boolean => status === 4

const Loading = (): React.ReactElement => (
  <div className="flex justify-center items-center h-75">
    <Spinner />
  </div>
)

interface ErrorMessageProps extends InjectedIntlProps {
  title: string
  description: string
  refetch: () => any
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
      <FormattedMessage id="pages.editor.store.settings.refetch" />
    </Button>
  </div>
)
const ErrorMessage = injectIntl(ErrorMessageComponent)

export const handleCornerCases = (
  options: { error: { title: string; description: string } },
  fn: (x: any) => any
) => ({ loading, error, data, refetch, networkStatus, ...rest }: any) => {
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
