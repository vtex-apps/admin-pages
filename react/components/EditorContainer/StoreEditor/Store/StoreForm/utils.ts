import { JSONSchema6, JSONSchema6Definition } from 'json-schema'
import { InjectedIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

export const formatSchema = (
  schema: JSONSchema6Definition,
  intl: InjectedIntl
): JSONSchema6Definition => {
  if (typeof schema === 'boolean') {
    return schema
  }

  return Object.entries(schema).reduce<JSONSchema6>(
    (acc, [currKey, currValue]) => {
      let formattedValue: unknown

      if (
        typeof currValue === 'object' &&
        currValue !== null &&
        !Array.isArray(currValue)
      ) {
        formattedValue = formatSchema(currValue, intl)
      } else if (typeof currValue === 'string') {
        formattedValue = formatIOMessage({ id: currValue, intl })
      } else {
        formattedValue = currValue
      }

      return {
        ...acc,
        [currKey]: formattedValue,
      }
    },
    schema
  )
}

export const tryParseJson = (str: string): { [k: string]: unknown } => {
  let parsed = null

  try {
    if (str) {
      parsed = JSON.parse(str)
    }
  } catch (e) {
    console.error(e)
  }

  return parsed
}
