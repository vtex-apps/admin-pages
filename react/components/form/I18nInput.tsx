import React from 'react'

import { appendInvisibleCharacter } from '../../utils/components'

import BaseInput from './BaseInput'
import TextArea from './TextArea'
import { CustomWidgetProps } from './typings'

interface Props extends CustomWidgetProps {
  isTextarea?: boolean
}

/*
 * While there isn't currently an efficient way to update the inner Runtime's
 * intl, this component uses the IOMessage's fallback behavior to modify i18n
 * properties.
 *
 * Since the value actually represents an i18n key, typing in the name of an
 * existing one would cause the block to render the corresponding intl string.
 *
 * In order to prevent that, this component adds an invisible character after
 * the input value, so it will (probably) never match an i18n key. The
 * invisible character is removed once the form is submitted, before being sent
 * to the server.
 */

const I18nInput: React.FunctionComponent<Props> = ({
  isTextarea,
  onChange,
  value,
  ...commonProps
}) => {
  const [localValue, setLocalValue] = React.useState(value)

  const safeOnChange: CustomWidgetProps<
    HTMLInputElement | HTMLTextAreaElement
  >['onChange'] = React.useCallback(
    (newValue, target) => {
      if (typeof newValue !== 'string' || !target) {
        return
      }

      let cursorPosition = target.selectionStart

      // Appends an invisible character to the input value. For more
      // information, please read the comment above this component.
      onChange(appendInvisibleCharacter(newValue))

      setLocalValue(newValue)

      // Prevents the cursor from jumping around
      target.selectionStart = cursorPosition
    },
    [onChange]
  )

  const finalProps = {
    ...commonProps,
    onChange: safeOnChange,
    value: localValue,
  }

  if (isTextarea) {
    return <TextArea {...finalProps} />
  }

  return <BaseInput {...finalProps} />
}

export default I18nInput
