import { assocPath, mergeDeepRight, reduce, toPairs, merge } from 'ramda'
import Ajv from 'vtex.ajv'
import { global, Window } from 'vtex.render-runtime'

import {
  GetComponentSchemaParams,
  GetSchemaPropsOrContentFromRuntimeParams,
  GetSchemaPropsOrContentParams,
  TranslateMessageParams,
  UpdateExtensionFromFormParams,
} from './typings'

export const IOMESSAGE_FORMAT_TYPE = 'IOMessage'
export const RICHTEXT_FORMAT_TYPE = 'RichText'
export const IO_MESSAGE_FORMATS = [IOMESSAGE_FORMAT_TYPE, RICHTEXT_FORMAT_TYPE]

const reduceProperties = (isContent: boolean) => (
  acc: ComponentSchemaProperties,
  [propertyName, property]: [string, ComponentSchema]
) => {
  if (property.type === 'object') {
    property.properties = reduce(
      reduceProperties(isContent),
      {},
      toPairs(property.properties)
    )
  }
  if (Boolean(property.isLayout) !== isContent) {
    acc[propertyName] = property
  }

  return acc
}

const hideLayoutOrContentFromSchema = (
  schema: ComponentSchema,
  isContent: boolean
) => {
  if (Boolean(schema.isLayout) === isContent) {
    return {}
  }

  if (schema.type === 'object' && schema.properties) {
    const newSchema = {
      ...schema,
      properties: reduce(
        reduceProperties(isContent),
        {},
        toPairs(schema.properties)
      ),
    }
    return newSchema
  }

  return schema
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

export const getComponentSchema = ({
  component,
  contentSchema,
  isContent,
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

  const adaptedComponentSchema = hideLayoutOrContentFromSchema(
    setArraySchemaDefaultsDeep(componentSchema),
    isContent
  )

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
    composition = 'blocks',
    configurationsIds = [],
    content = {},
    contentMapId = '',
    implementationIndex = 0,
    implements: extensionImplements = [],
    props = {},
    shouldRender = false,
    title = '',
  } = extensions[editTreePath!] || {}

  return {
    after,
    around,
    before,
    blockId,
    blocks,
    component,
    composition,
    configurationsIds,
    content,
    contentMapId,
    implementationIndex,
    implements: extensionImplements,
    props: props || {},
    shouldRender,
    title,
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
  schema,
  propsOrContent,
}: GetSchemaPropsOrContentParams): object => {
  const validate = getIOMessageAjv().compile(schema)
  validate(propsOrContent)
  const dataFromSchema = validate.validatedData!.reduce(
    (acc: any, { value, format, dataPath, isLayout }: any) => {
      if (isLayout) {
        return acc
      }
      if (IOMESSAGE_FORMAT_TYPE.includes(format) && messages) {
        const id =
          i18nMapping && i18nMapping[value] !== undefined
            ? i18nMapping[value]
            : value
        const ioMessage = translateMessage({
          dictionary: messages,
          id,
        })
        return { ...acc, ...assocPath(dataPath, ioMessage, acc) }
      } else {
        return { ...acc, ...assocPath(dataPath, value, acc) }
      }
    },
    {}
  )
  return keepTheBlanks(dataFromSchema, propsOrContent)
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
    isContent,
    propsOrContent,
    runtime,
  })

  return getSchemaPropsOrContent({
    isContent,
    messages,
    propsOrContent,
    schema: componentSchema,
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
  return runtime.updateExtension(treePath, {
    ...runtime.extensions[treePath],
    [isContent ? 'content' : 'props']: data,
  })
}

const getIOMessageAjv = () => {
  const opts = {
    shouldStoreValidSchema: true,
    useDefaults: true,
    nullable: true,
  }
  const ajv = new Ajv(opts)
  const validationFunction = (value: string) => {
    return value.length >= 0
  }

  IO_MESSAGE_FORMATS.forEach(format => {
    ajv.addFormat(format, {
      type: 'string',
      validate: validationFunction,
    })
  })

  return ajv
}

const keepTheBlanks = (
  validData: object,
  formData: Record<string, any> | undefined
) => {
  if (!formData) {
    return validData
  }

  return merge(
    validData,
    toPairs(formData).reduce((acc, [prop, value]) => {
      if (!(prop in validData)) {
        return { ...acc, [prop]: value == null ? null : value }
      }
      return acc
    }, {})
  )
}
