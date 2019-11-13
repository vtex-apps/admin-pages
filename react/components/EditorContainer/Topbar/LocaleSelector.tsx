import React from 'react'
import { Dropdown } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'

interface Props {
  emitter: RenderContext['emitter']
  initialLocale: RenderContext['culture']['locale']
}

const LocaleSelector: React.FC<Props> = ({ emitter, initialLocale }) => {
  const [locale, setLocale] = React.useState(initialLocale)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocale(e.target.value)

      emitter.emit('localesChanged', e.target.value)
    },
    [emitter]
  )

  const editor = useEditorContext()

  return (
    <Dropdown
      size="small"
      onChange={handleChange}
      options={editor.availableCultures}
      value={locale}
    />
  )
}

export default LocaleSelector
