import { merge, mergeDeepRight } from 'ramda'
import { global, Window } from 'vtex.render-runtime'

import {
  GetComponentSchemaParams,
  GetSchemaPropsOrContentFromRuntimeParams,
  GetSchemaPropsOrContentParams,
  TranslateMessageParams,
  UpdateExtensionFromFormParams,
} from './typings'

export const getComponentSchema = ({
  component,
  contentSchema,
  propsOrContent,
  runtime,
}: GetComponentSchemaParams): ComponentSchema => {
  const componentSchema: ComponentSchema = (component &&
    (component.schema ||
      (component.getSchema &&
        component.getSchema(propsOrContent, { routes: runtime.pages })))) || {
    properties: {},
    type: 'object',
  }

  const setArraySchemaDefaultsDeep: (
    schema: ComponentSchema
  ) => ComponentSchema = schema => {
    if (schema.type === 'array') {
      schema.items = setArraySchemaDefaultsDeep(schema.items)

      if (!schema.minItems || schema.minItems < 1) {
        schema.minItems = 1
      }

      schema.items.properties = {
        __editorItemTitle: {
          default: schema.items.title,
          title: 'Item title',
          type: 'string',
        },
        ...schema.items.properties,
      }
    }

    return schema
  }

  const adaptedComponentSchema = setArraySchemaDefaultsDeep(componentSchema)

  if (!contentSchema) {
    return adaptedComponentSchema
  }

  return mergeDeepRight(adaptedComponentSchema, contentSchema)
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

export const getIframeImplementation = (component: string | null) => {
  if (component === null) {
    return null
  }

  const iframeRenderComponents = getIframeRenderComponents()

  return iframeRenderComponents && iframeRenderComponents[component]
}

export const getIframeRenderComponents = () => {
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

export const getImplementation = (component: string) => {
  return global.__RENDER_8_COMPONENTS__[component]
}

export const getSchemaPropsOrContent = ({
  i18nMapping,
  isContent = false,
  messages,
  properties,
  propsOrContent,
}: GetSchemaPropsOrContentParams): object => {
  if (!properties || !propsOrContent) {
    return {}
  }

  const keysWithData = Object.keys(properties).filter(
    key => propsOrContent[key] !== undefined
  )

  return keysWithData.reduce((acc, currKey: string) => {
    const currProperty = properties[currKey]

    if (
      !currProperty ||
      (!currProperty.isLayout !== isContent && currProperty.type !== 'object')
    ) {
      return acc
    }

    const adaptedProperty = {
      [currKey]:
        currProperty.type === 'object'
          ? getSchemaPropsOrContent({
              isContent,
              messages,
              properties: currProperty.properties,
              propsOrContent: propsOrContent[currKey],
            })
          : currProperty.format === 'IOMessage' && messages
          ? translateMessage({
              dictionary: messages,
              id:
                propsOrContent[
                  i18nMapping && i18nMapping[currKey] !== undefined
                    ? i18nMapping[currKey]
                    : currKey
                ],
            })
          : propsOrContent[currKey],
    }

    return merge(acc, adaptedProperty)
  }, {})
}

export const getSchemaPropsOrContentFromRuntime = ({
  component,
  contentSchema,
  isContent = false,
  messages,
  propsOrContent,
  runtime,
}: GetSchemaPropsOrContentFromRuntimeParams) => {
  if (!component) {
    return null
  }

  const componentSchema = getComponentSchema({
    component,
    contentSchema,
    propsOrContent,
    runtime,
  })

  return getSchemaPropsOrContent({
    isContent,
    messages,
    properties: componentSchema.properties,
    propsOrContent,
  })
}

export const translateMessage = ({
  dictionary,
  id,
}: TranslateMessageParams): string => {
  if (!id) {
    return ''
  }

  const translatedMessage = dictionary[id]

  if (translatedMessage) {
    return translatedMessage
  }

  if (translatedMessage === '') {
    return ''
  }

  return id
}

export const updateExtensionFromForm = ({
  data,
  isContent = false,
  runtime,
  treePath,
}: UpdateExtensionFromFormParams) => {
  runtime.updateExtension(treePath, {
    ...runtime.extensions[treePath],
    [isContent ? 'content' : 'props']: data,
  })
}
