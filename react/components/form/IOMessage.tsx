import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'

import BaseInput from './BaseInput'

type Props = InjectedIntlProps & WidgetProps

const IOMessage: React.FunctionComponent<Props> = props => {
  const [i18nKey] = React.useState(props.value)

  const [value, setValue] = React.useState(
    props.intl.messages[i18nKey]
      ? props.intl.formatMessage({ id: i18nKey })
      : undefined
  )

  const handleChange = (newValue: string) => {
    props.formContext.addMessages({
      [i18nKey]: newValue,
    })

    setValue(newValue)
  }

  return <BaseInput {...props} onChange={handleChange} value={value} />
}

export default injectIntl(IOMessage)
