import { JSONSchema6 } from 'json-schema'
import traverse from 'json-schema-traverse'
import { assocPath, mergeDeepLeft } from 'ramda'
import { UiSchema, Widget } from 'react-jsonschema-form'

import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
} from '../../../../utils/components'

import { GetSchemasArgs } from './typings'

/**
 * Generates an `UiSchema` following the `Component Schema` definition of `widgets`.
 * Each schema property can define an widget especifying how to display it.
 * @param {object} componentUiSchema The default static `UiSchema` definition
 * @param {object} componentSchema The full `Component Schema` (already
 *  applyed the `getSchema`, if its the case)
 * @return {object} A object defining the complete `UiSchema` that matches all the schema
 *  properties.
 */
export const getUiSchema = (
  componentUiSchema: UiSchema,
  componentSchema: ComponentSchema
): UiSchema => {
  /**
   * It goes deep into the schema tree to find widget definitions, generating
   * the correct path to the property.
   * e.g:
   * {
   *   banner1: {
   *     numberOfLines: {
   *       value: {
   *         'ui:widget': 'range'
   *       }
   *     }
   *   }
   * }
   *
   * @param {object} properties The schema properties to be analysed.
   */

  const arrayAttrs = /(anyOf|oneOf|allOf|dependencies)(\/\d+|\/\w+)?/g
  const noUISchemaProp = [
    'definitions',
    'properties',
    'patternProperties',
    'additionalProperties',
  ]
  let uiSchema = {}

  const getWidget = (
    schema: JSONSchema6 & { widget: Widget },
    JSONPointer: string
  ) => {
    if (schema.widget) {
      const widgetPath = JSONPointer.replace(arrayAttrs, '')
        .split('/')
        .filter(
          (pointer: string) => pointer && !noUISchemaProp.includes(pointer)
        )
      uiSchema = assocPath(widgetPath, schema.widget, uiSchema)
    }
  }

  traverse(componentSchema, getWidget)

  return mergeDeepLeft(uiSchema, componentUiSchema)
}

export const getSchemas = ({
  contentSchema,
  editTreePath,
  iframeRuntime,
  isContent,
}: GetSchemasArgs) => {
  const extension = getExtension(editTreePath, iframeRuntime.extensions)
  const componentImplementation = getIframeImplementation(extension.component)

  const componentSchema = getComponentSchema({
    component: componentImplementation,
    contentSchema,
    isContent: true,
    propsOrContent: extension[isContent ? 'content' : 'props'],
    runtime: iframeRuntime,
  })

  const componentUiSchema =
    componentImplementation && componentImplementation.uiSchema
      ? componentImplementation.uiSchema
      : {}

  const uiSchemaFromComponent = getUiSchema(componentUiSchema, componentSchema)

  return {
    componentSchema,
    uiSchema: uiSchemaFromComponent,
  }
}
