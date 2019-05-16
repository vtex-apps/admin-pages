import debounce from 'lodash.debounce'
import React from 'react'
import { generate as generateUuid } from 'short-uuid'

import { translateMessage } from '../../utils/components'
import { useFormMetaContext } from '../EditorContainer/Sidebar/FormMetaContext'

import BaseInput from './BaseInput'
import { CustomWidgetProps } from './typings'

const IOMessage: React.FunctionComponent<CustomWidgetProps> = props => {
  const {
    addToI18nMapping,
    getI18nMapping,
    getWasModified,
    setWasModified,
  } = useFormMetaContext()

  const i18nKey = props.value

  const initialValue = React.useMemo(
    () =>
      translateMessage({
        dictionary: props.formContext.messages,
        id: i18nKey,
      }),
    []
  )

  const [value, setValue] = React.useState(initialValue)

  const mappedI18nKey = React.useMemo(generateUuid, [])

  const updateIframeValue = React.useMemo(
    () =>
      debounce((newValue: string) => {
        const i18nMapping = getI18nMapping()

        if (!i18nMapping[i18nKey]) {
          addToI18nMapping({ [i18nKey]: mappedI18nKey })

          props.onChange(mappedI18nKey)
        }

        props.formContext.addMessages({
          [mappedI18nKey]: newValue,
        })
      }, 200),
    []
  )

  const handleChange = React.useCallback((newValue: string) => {
    const wasModified = getWasModified()

    updateIframeValue(newValue)

    if (!wasModified) {
      setWasModified(true)
    }

    setValue(newValue)
  }, [])

  return <BaseInput {...props} onChange={handleChange} value={value} />
}

export default IOMessage
