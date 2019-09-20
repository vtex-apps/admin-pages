// This file is .tsx because otherwise the babel plugin for messages doesn't work.
import { concat } from 'ramda'
import languagesQuery from '../../queries/Languages.graphql'
import messages from './cultureMessages'
import {
  AvailableCulturesProps,
  LabelledLocale,
  Languages,
  Variables,
} from './typings'

// TODO: Remove this when messages solve this case
const DEFAULT_LANGUAGES = ['en-US', 'pt-BR', 'es-AR']

function isValidLang(key: string): key is keyof typeof messages {
  return Object.prototype.hasOwnProperty.call(messages, key)
}

export const getAvailableCultures = async ({
  client,
  intl,
}: AvailableCulturesProps) => {
  const {
    data: { languages },
  } = await client.query<Languages, Variables>({
    query: languagesQuery,
  })

  let { supported } = languages
  supported = Array.from(new Set(concat(supported, DEFAULT_LANGUAGES)))

  return supported
    .reduce(
      (acc, locale) => {
        const [lang, country] = locale.split('-')
        if (!lang || !country) {
          return acc
        }
        const i18nId = isValidLang(lang)
          ? messages[lang] && messages[lang].id
          : `admin/pages.editor.locale.${lang}`

        return [
          ...acc,
          {
            label: `${intl.formatMessage({ id: i18nId })} (${locale})`,
            value: locale,
          },
        ]
      },
      [] as LabelledLocale[]
    )
    .sort((a: LabelledLocale, b: LabelledLocale) =>
      a.label.localeCompare(b.label)
    )
}

export { LabelledLocale }
export { editorMessagesFromRuntime } from './editorMessagesFromRuntime'
