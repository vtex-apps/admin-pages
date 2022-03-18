import { JSONSchema6Definition } from 'json-schema'
import { IntlShape } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

interface FormatSchemaArgs {
  schema: JSONSchema6Definition
  intl: IntlShape
  ignore?: string[]
}

/**
 * Returns the original object without the received properties
 * @param object
 * @param properties
 */
export const removeObjectProperties = (
  object: Record<string, any>,
  properties: string[]
) => {
  let newObject = object

  properties.forEach(property => {
    const { [property]: deletedProperty, ...otherProperties } = newObject
    newObject = otherProperties
  })

  return newObject
}

export const formatSchema = ({
  schema,
  intl,
  ignore,
}: FormatSchemaArgs): JSONSchema6Definition => {
  if (typeof schema === 'boolean') {
    return schema
  }
  const filteredSchema = ignore
    ? removeObjectProperties(schema, ignore)
    : schema

  return Object.entries(filteredSchema).reduce<Record<string, any>>(
    (acc, [currKey, currValue]) => {
      let formattedValue: unknown

      if (
        typeof currValue === 'object' &&
        currValue !== null &&
        !Array.isArray(currValue)
      ) {
        formattedValue = formatSchema({ schema: currValue, intl })
      } else if (typeof currValue === 'string') {
        formattedValue = formatIOMessage({ id: currValue, intl })
      } else {
        formattedValue = currValue
      }

      acc[currKey] = formattedValue
      return acc
    },
    filteredSchema
  )
}

export const tryParseJson = <T>(str: string): T => {
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
