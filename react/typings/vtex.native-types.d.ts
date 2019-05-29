declare module 'vtex.native-types' {
  import { FunctionComponent } from 'react'
  import { FormattedMessage, InjectedIntlProps } from 'react-intl'

  const formatIOMessage: (
    adaptedMessageDescriptor: FormattedMessage.MessageDescriptor &
      InjectedIntlProps,
    values?: Record<string, MessageValue>
  ) => string

  export const IOMessage: FunctionComponent<
    FormattedMessage.Props & InjectedIntlProps
  >
}
