import React from 'react'
import { Dropdown, Tooltip } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import { DropdownOptions } from './typings'
import { useEditorContext } from '../../../EditorContext'

interface Props {
  className?: string
  iframeRuntime: RenderContext
  isDisabled: boolean
  options: DropdownOptions
}

const LocaleSelector: React.FC<Props> = ({
  className,
  iframeRuntime,
  isDisabled,
  options,
}) => {
  const { culture, emitter } = iframeRuntime

  const [locale, setLocale] = React.useState(culture.locale)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocale(e.target.value)

      emitter.emit('localesChanged', e.target.value)
    },
    [emitter]
  )

  const Selector = () => (
    <div className={className}>
      <Dropdown
        disabled={isDisabled}
        onChange={handleChange}
        options={options}
        size="small"
        value={locale}
      />
    </div>
  )

  const editor = useEditorContext()
  const intl = useIntl()

  return editor.editTreePath ? (
    <Tooltip
      label={intl.formatMessage({
        defaultMessage: 'The locale cannot be changed while editing a block.',
        id: 'admin/pages.editor.topbar.context.locale.tooltip',
      })}
      position="bottom"
    >
      <div className="flex">
        <Selector />
      </div>
    </Tooltip>
  ) : (
    <Selector />
  )
}

export default LocaleSelector
