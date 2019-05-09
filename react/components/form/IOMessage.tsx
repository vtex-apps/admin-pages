import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'

import { useFormMetaContext } from '../EditorContainer/Sidebar/FormMetaContext'
import { useEditorContext } from '../EditorContext'

import BaseInput from './BaseInput'

type Props = InjectedIntlProps & WidgetProps

const IOMessage: React.FunctionComponent<Props> = props => {
  const { addMessages, messages } = useEditorContext()
  const { setWasModified, wasModified } = useFormMetaContext()

  const [i18nKey] = React.useState(props.value)

  const message = messages[i18nKey]

  const initialValue = message || (message === '' ? '' : i18nKey)

  const [value, setValue] = React.useState(initialValue)

  const handleChange = React.useCallback((newValue: string) => {
    addMessages({
      [i18nKey]: newValue,
    })

    if (!wasModified) {
      setWasModified(true)
    }

    setValue(newValue)
  }, [])

  return <BaseInput {...props} onChange={handleChange} value={value} />
}

export default injectIntl(IOMessage)
