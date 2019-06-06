import debounce from 'lodash.debounce'
import React from 'react'
import { generate as generateUuid } from 'short-uuid'

import { translateMessage } from '../../utils/components'
import { useFormMetaContext } from '../EditorContainer/Sidebar/FormMetaContext'

import BaseInput from './BaseInput'
import TextArea from './TextArea'
import { CustomWidgetProps } from './typings'

interface Props extends CustomWidgetProps {
  isTextarea?: boolean
}

const I18nInput: React.FunctionComponent<Props> = props => {
  const {
    addToI18nMapping,
    getI18nMapping,
    getWasModified,
    setWasModified,
  } = useFormMetaContext()

  const isValueI18nKey = React.useMemo(
    () => typeof props.formContext.messages[props.value] !== 'undefined',
    [props.value]
  )

  const i18nKey = React.useMemo(
    () => {
      if (isValueI18nKey) {
        return props.value
      }

      return 'store/' + generateUuid()
    },
    [isValueI18nKey]
  )

  const initialValue = React.useMemo(
    () =>
      isValueI18nKey
        ? translateMessage({
            dictionary: props.formContext.messages,
            id: i18nKey,
          })
        : props.value,
    []
  )

  const [value, setValue] = React.useState(initialValue)

  const mappedI18nKey = React.useMemo(generateUuid, [])

  const updateIframeValue = React.useMemo(
    () =>
      debounce((newValue: string) => {
        const i18nMapping = getI18nMapping()

        if (i18nMapping[i18nKey] === undefined) {
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

  const finalProps = {
    ...props,
    onChange: handleChange,
    value,
  }

  if (props.isTextarea) {
    return <TextArea {...finalProps} />
  }

  return <BaseInput {...finalProps} />
}

export default I18nInput
