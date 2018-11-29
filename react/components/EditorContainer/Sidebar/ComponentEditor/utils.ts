import {
  has,
  map,
  mergeDeepLeft,
  pickBy,
} from 'ramda'

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
  componentUiSchema: UISchema,
  componentSchema: ComponentSchema,
): UISchema => {
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
  const getDeepUiSchema = (properties: any): UISchema => {
    const deepProperties = pickBy(
      property => has('properties', property),
      properties,
    )
    const itemsProperties = pickBy(
      property => has('properties', property),
      properties.items,
    )

    return {
      ...map(
        value => value.widget,
        pickBy(property => has('widget', property), properties),
      ),
      ...(deepProperties &&
        map(property => getDeepUiSchema(property.properties), deepProperties)),
      ...(itemsProperties &&
        map(item => getDeepUiSchema(item), itemsProperties)),
    }
  }

  const uiSchema = {
    ...map(value => value.widget, pickBy(
      property => has('widget', property),
      componentSchema.properties as ComponentSchemaProperties,
    ) as { widget: any }),
    ...map(property => getDeepUiSchema(property.properties), pickBy(
      property => has('properties', property),
      componentSchema.properties as ComponentSchemaProperties,
    ) as ComponentSchemaProperties),
    ...map(
      property => getDeepUiSchema(property),
      pickBy(
        property => has('items', property),
        componentSchema.properties as ComponentSchemaProperties,
      ),
    ),
  }

  return mergeDeepLeft(uiSchema, componentUiSchema || {})
}
