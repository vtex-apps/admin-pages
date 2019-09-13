import { assocPath, merge, mergeDeepRight, reduce, toPairs } from 'ramda'
import Ajv from 'vtex.ajv'
import { global, Window } from 'vtex.render-runtime'

import {
  GetComponentSchemaParams,
  GetSchemaPropsOrContentFromRuntimeParams,
  GetSchemaPropsOrContentParams,
  PropsOrContent,
  TranslateMessageParams,
  UpdateExtensionFromFormParams,
} from './typings'

export const IOMESSAGE_FORMAT_TYPE = 'IOMessage'
export const RICHTEXT_FORMAT_TYPE = 'RichText'
export const IO_MESSAGE_FORMATS = [IOMESSAGE_FORMAT_TYPE, RICHTEXT_FORMAT_TYPE]

const INVISIBLE_CHARACTER = '\u200b'

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
  schema: ComponentSchema | ComponentSchema[],
  isContent: boolean
) => {
  if (Array.isArray(schema) || Boolean(schema.isLayout) === isContent) {
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
  schema: ComponentSchema | ComponentSchema['items']
) => ComponentSchema | ComponentSchema[] = schema => {
  if (!schema || Array.isArray(schema) || schema.type !== 'array') {
    return typeof schema === 'undefined' ? {} : schema
  }

  schema.items = setArraySchemaDefaultsDeep(schema.items)

  if (!schema.minItems || schema.minItems < 1) {
    schema.minItems = 1
  }

  if (schema.items && !Array.isArray(schema.items)) {
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
  editTreePath: EditorContextType['editTreePath'],
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
    hasContentSchema = false,
    implementationIndex = 0,
    implements: extensionImplements = [],
    preview = null,
    props = {},
    render = 'server',
    shouldRender = false,
    track = [],
    title = '',
  } = (editTreePath && extensions[editTreePath]) || {}

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
    hasContentSchema,
    implementationIndex,
    implements: extensionImplements,
    preview,
    props: props || {},
    render,
    shouldRender,
    track,
    title,
  }
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

export const getIframeImplementation = (component: string | null) => {
  if (component === null) {
    return null
  }

  const iframeRenderComponents = getIframeRenderComponents()

  return iframeRenderComponents && iframeRenderComponents[component]
}

const translateMessage = ({
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
  if (!treePath) {
    return
  }

  return runtime.updateExtension(treePath, {
    ...runtime.extensions[treePath],
    [isContent ? 'content' : 'props']: data,
  })
}

const getIOMessageAjv = () => {
  const opts = {
    allErrors: true,
    nullable: true,
    shouldStoreValidSchema: true,
    useDefaults: true,
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

const emptyFields: Record<string, unknown> = {
  any: {},
  array: [],
  boolean: false,
  integer: null,
  number: null,
  object: {},
  string: '',
}

const getSchemaEmptyObj = (schema: ComponentSchema, prop: string) => {
  const type =
    schema &&
    schema.properties &&
    schema.properties[prop] &&
    schema.properties[prop].type
  return type ? emptyFields[type] : null
}

const keepTheBlanks = (
  validData: object,
  formData: Record<string, unknown> | undefined,
  schema: Record<string, ComponentSchema>
): Record<string, unknown> => {
  if (!formData) {
    return validData as Record<string, unknown>
  }

  return merge(
    validData,
    toPairs(formData).reduce((acc, [prop, value]) => {
      if (!(prop in validData)) {
        return {
          ...acc,
          [prop]: value == null ? getSchemaEmptyObj(schema, prop) : value,
        }
      }
      return acc
    }, {})
  )
}

export const appendInvisibleCharacter = (text: string) =>
  text + INVISIBLE_CHARACTER

const removeInvisibleCharacter = (text: string) => {
  const lastIndex = text.length - 1

  if (text[lastIndex] !== INVISIBLE_CHARACTER) {
    return text
  }

  return text.slice(0, lastIndex)
}

export const getImplementation = (component: string) => {
  return global.__RENDER_8_COMPONENTS__[component]
}

export const getSchemaPropsOrContent = ({
  messages,
  schema,
  propsOrContent,
}: GetSchemaPropsOrContentParams): PropsOrContent => {
  const validate = getIOMessageAjv().compile(schema)
  validate(propsOrContent)

  if (!validate.validatedData) {
    return {}
  }

  const dataFromSchema = validate.validatedData.reduce(
    (acc, { value, format, dataPath, isLayout }) => {
      if (isLayout) {
        return acc
      }

      if (IO_MESSAGE_FORMATS.includes(format)) {
        let adaptedValue

        if (messages) {
          adaptedValue = translateMessage({
            dictionary: messages,
            id: value,
          })
        } else {
          // Removes the invisible character from i18n fields. For more
          // information, please check the I18nInput widget.
          adaptedValue = removeInvisibleCharacter(value)
        }

        return { ...acc, ...assocPath(dataPath, adaptedValue, acc) }
      }

      return { ...acc, ...assocPath(dataPath, value, acc) }
    },
    {}
  )

  return keepTheBlanks(dataFromSchema, propsOrContent, schema)
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
    messages,
    propsOrContent,
    schema: componentSchema,
  })
}
