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
      editor.setMode('disabled')

      setLocale(e?.target?.value)

      emitter.emit(
        'localesChanged',
        e?.target?.value,
        null,
        (locale: string) => {
          let bindingQueryString

          if (editor.iframeWindow) {
            const searchParams = new URLSearchParams(
              editor?.iframeWindow?.location.search
            )

            const bindingAddress = searchParams.get('__bindingAddress')

            if (bindingAddress) {
              bindingQueryString = `__bindingAddress=${decodeURIComponent(
                bindingAddress
              )}`
            }

            if (e?.target?.value) {
              editor.iframeWindow.location.search = `${bindingQueryString}&__locale=${e.target.value}&__siteEditor=true`
            } else {
              editor.iframeWindow.location.search = `${bindingQueryString}&__locale=${locale}&__siteEditor=true`
            }
          }
        }
      )
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
