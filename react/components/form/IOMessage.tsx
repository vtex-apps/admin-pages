import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'

import {
  ComponentEditorFormContext,
  FormMetaContext,
} from '../EditorContainer/Sidebar/typings'

import BaseInput from './BaseInput'

interface CustomWidgetProps extends WidgetProps {
  formContext: ComponentEditorFormContext & {
    editor: EditorContext
    formMeta: FormMetaContext
  }
}

type Props = CustomWidgetProps & InjectedIntlProps

const IOMessage: React.FunctionComponent<Props> = props => {
  const { editor, formMeta } = props.formContext

  const [i18nKey] = React.useState(props.value)

  const message = editor.messages[i18nKey]

  const initialValue = message || (message === '' ? '' : i18nKey)

  const [value, setValue] = React.useState(initialValue)

  const handleChange = React.useCallback((newValue: string) => {
    editor.addMessages({
      [i18nKey]: newValue,
    })

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }

    setValue(newValue)
  }, [])

  return <BaseInput {...props} onChange={handleChange} value={value} />
}

export default injectIntl(IOMessage)
