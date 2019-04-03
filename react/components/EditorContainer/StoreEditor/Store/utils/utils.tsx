import React from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { EmptyState, Spinner } from 'vtex.styleguide'

const Loading = (): React.ReactElement => (
  <div className="flex justify-center">
    <Spinner />
  </div>
)

const ErrorMessageComponent: React.FunctionComponent<
  InjectedIntlProps & { title: string; description: string }
> = ({ intl, title, description }): React.ReactElement => (
  <div className="flex justify-center">
    <EmptyState
      title={intl.formatMessage({
        id: title,
      })}
    >
      <FormattedMessage id={description} />
    </EmptyState>
  </div>
)
const ErrorMessage = injectIntl(ErrorMessageComponent)

export const handleCornerCases = (
  options: { error: { title: string; description: string } },
  fn: (x: any) => any
) => ({ loading, error, data, ...rest }: any) => {
  if (loading) {
    return <Loading />
  }
  if (error || !data) {
    const { error: errorMessage } = options
    console.error('Error', error)
    return <ErrorMessage {...errorMessage} />
  }

  return fn({ data, ...rest })
}
