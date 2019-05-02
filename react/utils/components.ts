import { JSONSchema6 } from 'json-schema'
import {
  filter,
  has,
  keys,
  map,
  merge,
  mergeDeepRight,
  pick,
  reduce,
} from 'ramda'
import { IChangeEvent } from 'react-jsonschema-form'
import { global, RenderComponent, Window } from 'vtex.render-runtime'

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
  propsOrContent: object,
  runtime: RenderContext,
  intl: ReactIntl.InjectedIntl,
  contentSchema?: JSONSchema6
): ComponentSchema => {
  const componentSchema: ComponentSchema = (component &&
    (component.schema ||
      (component.getSchema &&
        component.getSchema(propsOrContent, { routes: runtime.pages })))) || {
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
    schema: ComponentSchema
  ) => ComponentSchema = schema => {
    const translate: (
      value: string | { id: string; values?: { [key: string]: string } }
    ) => string = value =>
      typeof value === 'string'
        ? intl.formatMessage({ id: value })
        : intl.formatMessage({ id: value.id }, value.values || {})

    const translatedSchema: ComponentSchema = map(
      (value: any): any =>
        Array.isArray(value) ? map(translate, value) : translate(value),
      pick(['title', 'description', 'enumNames'], schema) as object
    )

    if (has('widget', schema)) {
      translatedSchema.widget = merge(
        schema.widget,
        map(
          translate,
          pick(
            ['ui:help', 'ui:title', 'ui:description', 'ui:placeholder'],
            schema.widget
          )
        )
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
        keys(schema.properties)
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

  const runtimeSchema = traverseAndTranslate(componentSchema)

  if (!contentSchema) {
    return runtimeSchema
  }

  return mergeDeepRight(runtimeSchema, contentSchema)
}

export const getExtension = (
  editTreePath: EditorContext['editTreePath'],
  extensions: RenderContext['extensions']
): Required<Extension> => {
  const {
    after = [],
    around = [],
    before = [],
    blockId = '',
    blocks = [],
    component = null,
    configurationsIds = [],
    content = {},
    implementationIndex = 0,
    implements: extensionImplements = [],
    props = {},
    shouldRender = false,
  } = extensions[editTreePath!] || {}

  return {
    after,
    around,
    before,
    blockId,
    blocks,
    component,
    configurationsIds,
    content,
    implementationIndex,
    implements: extensionImplements,
    props: props || {},
    shouldRender,
  }
}

export function getIframeImplementation(component: string | null) {
  if (component === null) {
    return null
  }

  const iframeRenderComponents = getIframeRenderComponents()

  return iframeRenderComponents && iframeRenderComponents[component]
}

export function getIframeRenderComponents() {
  const iframe = document.getElementById('store-iframe') as HTMLIFrameElement
  if (!iframe) {
    return null
  }
  const window = iframe.contentWindow as Window | null
  if (!window) {
    return null
  }
  return window.__RENDER_8_COMPONENTS__
}

export function getImplementation(component: string) {
  return global.__RENDER_8_COMPONENTS__[component]
}

export const getSchemaPropsOrContent = (
  component: RenderComponent<any, any> | null,
  propsOrContent: object,
  runtime: RenderContext,
  intl: ReactIntl.InjectedIntl,
  messages: EditorContext['messages'],
  isContent: boolean = false,
  contentSchema?: JSONSchema6
) => {
  if (!component) {
    return null
  }

  /**
   * Recursively get the props or content defined in the properties.
   *
   * @param {object} properties The schema properties
   * @param {object} prevPropsOrContent The previous props or content passed to the component
   * @return {object} Actual component props or content
   */
  const getPropsOrContentFromSchema = (
    properties: any = {},
    prevPropsOrContent: any
  ): object =>
    reduce(
      (nextPropsOrContent, key: string) =>
        !properties[key].isLayout === isContent ||
        properties[key].type === 'object'
          ? merge(nextPropsOrContent, {
              [key]:
                properties[key].type === 'object'
                  ? getPropsOrContentFromSchema(
                      properties[key].properties,
                      prevPropsOrContent[key]
                    )
                  : properties[key].format === 'IOMessage'
                  ? messages[prevPropsOrContent[key]]
                  : prevPropsOrContent[key],
            })
          : nextPropsOrContent,
      {},
      filter(v => prevPropsOrContent[v] !== undefined, keys(properties))
    )

  const componentSchema = getComponentSchema(
    component,
    propsOrContent,
    runtime,
    intl,
    contentSchema
  )

  return getPropsOrContentFromSchema(componentSchema.properties, propsOrContent)
}

export const updateExtensionFromForm = (
  editor: EditorContext,
  event: IChangeEvent,
  intl: ReactIntl.InjectedIntl,
  runtime: RenderContext,
  isContent?: boolean,
  contentSchema?: JSONSchema6
) => {
  const extension = editor.editTreePath
    ? runtime.extensions[editor.editTreePath]
    : null
  const component = extension ? extension.component : null
  const componentImplementation = getIframeImplementation(component)

  const propsOrContent = getSchemaPropsOrContent(
    componentImplementation,
    event.formData,
    runtime,
    intl,
    editor.messages,
    isContent,
    contentSchema
  )

  runtime.updateExtension(editor.editTreePath as string, {
    ...runtime.extensions[editor.editTreePath!],
    [isContent ? 'content' : 'props']: propsOrContent,
  })
}
