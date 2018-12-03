import { filter, has, keys, map, merge, pick, reduce } from 'ramda'
import { IChangeEvent } from 'react-jsonschema-form'
import { global, RenderComponent, Window } from 'render'

/**
 * It receives a component implementation and decide which type of schema
 * will use, a static (schema) or a dynamic (getSchema) schema.
 * If none, returns a JSON specifying a simple static schema.
 *
 * @param {object} component The component implementation
 * @param {object} props The component props to be passed to the getSchema
 */
export const getComponentSchema = (
  component: RenderComponent<any, any> | null,
  props: any,
  runtime: RenderContext,
  intl: ReactIntl.InjectedIntl,
): ComponentSchema => {
  const componentSchema: ComponentSchema = (component &&
    (component.schema ||
      (component.getSchema &&
        component.getSchema(props, { routes: runtime.pages })))) || {
    properties: {},
    type: 'object',
  }

  /**
   * Traverse the schema properties searching for the title, description and enum
   * properties and translate their value using the messages from the intl context
   *
   * @param {object} schema Schema to be translated
   * @return {object} Schema with title, description and enumNames properties translated
   */
  const traverseAndTranslate: (
    schema: ComponentSchema,
  ) => ComponentSchema = schema => {
    const translate: (
      value: string | { id: string; values?: { [key: string]: string } },
    ) => string = value =>
      typeof value === 'string'
        ? intl.formatMessage({ id: value })
        : intl.formatMessage({ id: value.id }, value.values || {})

    const translatedSchema: ComponentSchema = map(
      (value: any): any =>
        Array.isArray(value) ? map(translate, value) : translate(value),
      pick(['title', 'description', 'enumNames'], schema) as object,
    )

    if (has('widget', schema)) {
      translatedSchema.widget = merge(
        schema.widget,
        map(
          translate,
          pick(
            ['ui:help', 'ui:title', 'ui:description', 'ui:placeholder'],
            schema.widget,
          ),
        ),
      )
    }

    if (schema.type === 'object') {
      translatedSchema.properties = reduce(
        (properties, key) =>
          merge(properties, {
            // @ts-ignore
            [key]: traverseAndTranslate(schema.properties[key]),
          }),
        {},
        keys(schema.properties),
      )
    }

    if (schema.type === 'array') {
      translatedSchema.items = traverseAndTranslate(schema.items)

      if (!schema.minItems || schema.minItems < 1) {
        translatedSchema.minItems = 1
      }

      translatedSchema.items.properties = {
        __editorItemTitle: {
          default: translatedSchema.items.title,
          title: 'Item title',
          type: 'string',
        },
        ...translatedSchema.items.properties,
      }
    }

    return merge(schema, translatedSchema)
  }

  return traverseAndTranslate(componentSchema)
}

export const getExtension = (
  editTreePath: EditorContext['editTreePath'],
  extensions: RenderContext['extensions'],
): Extension => {
  const { component = null, configurationsIds = [], props = {} } =
    extensions[editTreePath as string] || {}

  return { component, configurationsIds, props: props || {} }
}

export function getImplementation(component: string) {
  return global.__RENDER_7_COMPONENTS__[component]
}

export function getIframeImplementation(component: string | null) {
  if (component === null) {
    return null
  }

  const iframe = document.getElementById('store-iframe') as HTMLIFrameElement

  if (!iframe) {
    return null
  }

  const window = iframe.contentWindow as Window | null

  if (!window) {
    return null
  }

  return (
    window.__RENDER_7_COMPONENTS__ && window.__RENDER_7_COMPONENTS__[component]
  )
}

export const getSchemaProps = (
  component: RenderComponent<any, any> | null,
  props: object,
  runtime: RenderContext,
  intl: ReactIntl.InjectedIntl,
) => {
  if (!component) {
    return null
  }

  /**
   * Recursively get the props defined in the properties.
   *
   * @param {object} properties The schema properties
   * @param {object} prevProps The previous props passed to the component
   * @return {object} Actual component props
   */
  const getPropsFromSchema = (properties: any = {}, prevProps: any): object =>
    reduce(
      (nextProps, key) =>
        merge(nextProps, {
          [key]:
            properties[key].type === 'object'
              ? getPropsFromSchema(properties[key].properties, prevProps[key])
              : prevProps[key],
        }),
      {},
      filter(v => prevProps[v] !== undefined, keys(properties)),
    )

  const componentSchema = getComponentSchema(component, props, runtime, intl)

  return getPropsFromSchema(componentSchema.properties, props)
}

export const updateExtensionFromForm = (
  availableComponents: object[],
  editTreePath: EditorContext['editTreePath'],
  event: IChangeEvent,
  intl: ReactIntl.InjectedIntl,
  runtime: RenderContext,
) => {
  const { component: enumComponent } = event.formData
  const component = enumComponent && enumComponent !== '' ? enumComponent : null
  const componentImplementation =
    component && getIframeImplementation(component)

  if (component && !componentImplementation) {
    const allComponents = reduce(
      (acc: { [key: string]: any }, currComponent: any) => {
        acc[currComponent.name] = {
          assets: currComponent.assets,
          dependencies: currComponent.dependencies,
        }
        return acc
      },
      {},
      availableComponents,
    )

    runtime.updateComponentAssets(allComponents)
  }

  const props = getSchemaProps(
    componentImplementation,
    event.formData,
    runtime,
    intl,
  )

  runtime.updateExtension(editTreePath as string, {
    component,
    props,
  })
}
