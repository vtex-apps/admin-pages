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

  const editor = useEditorContext()

  const [locale, setLocale] = React.useState(culture.locale)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocale(e.target.value)

      emitter.emit('localesChanged', e.target.value, null, () => {
        if (editor.iframeWindow) {
          const searchParams = new URLSearchParams(
            editor.iframeWindow.location.search
          )

          const bindingQueryString = searchParams.get('__bindingAddress')

          editor.iframeWindow.location.search = `__bindingAddress=${bindingQueryString}&__localeAddress=${e.target.value}&__siteEditor=true`
        }
      })

      editor.setMode('disabled')
    },
    [emitter]
  )

  React.useEffect(() => {
    if (locale !== culture.locale) {
      setLocale(culture.locale)
    }

    if (editor.mode !== 'layout') editor.setMode('layout')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [culture.locale])

  const Selector = React.useCallback(
    () => (
      <div className={className}>
        <Dropdown
          disabled={isDisabled}
          onChange={handleChange}
          options={options}
          size="small"
          value={locale}
        />
      </div>
    ),
    [className, handleChange, isDisabled, locale, options]
  )

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
