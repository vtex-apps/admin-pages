import { merge, mergeDeepRight } from 'ramda'
import { global, Window } from 'vtex.render-runtime'

import {
  GetComponentSchemaParams,
  GetSchemaPropsOrContentFromRuntimeParams,
  GetSchemaPropsOrContentParams,
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
  isContent = false,
  messages,
  properties = {},
  propsOrContent,
}: GetSchemaPropsOrContentParams): object => {
  if (JSON.stringify(properties) === '{}') {
    return {}
  }

  const validProperties = Object.keys(properties).filter(
    key => propsOrContent[key] !== undefined
  )

  return validProperties.reduce((acc, currKey: string) => {
    if (
      !properties[currKey] ||
      (!properties[currKey].isLayout !== isContent &&
        properties[currKey].type !== 'object')
    ) {
      return acc
    }

    const adaptedProperty = {
      [currKey]:
        properties[currKey].type === 'object'
          ? getSchemaPropsOrContent({
              isContent,
              messages,
              properties: properties[currKey].properties,
              propsOrContent: propsOrContent[currKey],
            })
          : properties[currKey].format === 'IOMessage'
          ? messages[propsOrContent[currKey]]
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
