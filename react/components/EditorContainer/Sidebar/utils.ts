import throttle from 'lodash/throttle'
import { path, pathOr } from 'ramda'
import { ComponentsRegistry } from 'vtex.render-runtime'

import { getBlockPath } from '../../../utils/blocks'
import {
  getExtension,
  getIframeImplementation,
  getIframeRenderComponents,
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../utils/components'

import { isRootComponent } from './ComponentList/utils'
import { GetInitialFormState, SidebarComponent } from './typings'

export const generateWarningMessage = (name: string) =>
  `[Site Editor] Component "${name}" exports schema but doesn't have a "title" property, because of that, it won't appear in the lateral list. If this is intended, ignore this message.`

const isSamePage = (page: string, treePath: string) => {
  const pageHead = page && page.split('/')[0]
  const treePathHead = treePath && treePath.split('/')[0]

  return pageHead && treePathHead && treePathHead === pageHead
}

export const getInitialFormState: GetInitialFormState = ({
  data,
  editTreePath,
  iframeRuntime,
}) => {
  const extension = getExtension(editTreePath, iframeRuntime.extensions)

  const listContent = data && data.listContentWithSchema

  // TODO: get contentSchema from iframeRuntime so query is not needed
  const contentSchema = listContent && JSON.parse(listContent.schemaJSON)

  const activeContent =
    listContent && listContent.content && listContent.content[0]

  const content =
    (activeContent &&
      activeContent.contentJSON &&
      JSON.parse(activeContent.contentJSON)) ||
    {}

  const condition = activeContent && activeContent.condition

  const formData =
    getSchemaPropsOrContentFromRuntime({
      component: getIframeImplementation(extension.component),
      contentSchema,
      isContent: true,
      messages: iframeRuntime.messages,
      propsOrContent: content,
      runtime: iframeRuntime,
    }) || {}

  return {
    condition,
    content,
    contentSchema,
    formData,
  }
}

const getParentContainerBlocksGetter = (extensions: Extensions) => (
  parentPath: string
) => {
  const children = pathOr<InnerBlock[], InnerBlock[]>(
    [],
    [parentPath, 'children'],
    extensions
  )
  return pathOr<InnerBlock[], InnerBlock[]>(
    children,
    [parentPath, 'blocks'],
    extensions
  )
}

const getComponentNameGetterFromExtensions = (extensions: Extensions) => (
  treePath: string
) => (extensions[treePath] && extensions[treePath].component) || ''

const getComponentSchemaGetter = (
  components: ComponentsRegistry | null,
  extensions: Extensions
) => (treePath: string) => {
  const getComponentName = getComponentNameGetterFromExtensions(extensions)

  const extensionProps = pathOr({}, [treePath, 'props'], extensions)

  const component = getComponentName(treePath)

  const getSchema = path([component, 'getSchema'], { ...components })

  return (
    path([component, 'schema'], { ...components }) ||
    (typeof getSchema === 'function' && getSchema(extensionProps))
  )
}

export const hasContentPropsInSchema = (schema: ComponentSchema): boolean => {
  return (
    schema.type === 'object' &&
    Object.values(schema.properties || {}).some(
      property =>
        !property.isLayout ||
        (property.type === 'object' && hasContentPropsInSchema(property))
    )
  )
}

const getComponents = (
  extensions: Extensions,
  components: ComponentsRegistry | null,
  page: string
) => {
  const getParentContainerProps = getParentContainerBlocksGetter(extensions)

  const getComponentName = getComponentNameGetterFromExtensions(extensions)
  const getComponentSchema = getComponentSchemaGetter(components, extensions)

  const sidebarComponentMap: Record<string, SidebarComponent> = {}
  const isComponentEditableMap: Record<string, boolean> = {}

  return Object.keys(extensions)
    .filter(treePath => {
      const schema = getComponentSchema(treePath)
      const componentName = getComponentName(treePath)
      const hasTitleInSchema = schema && !!schema.title

      if (schema && !hasTitleInSchema) {
        console.warn(generateWarningMessage(componentName))
      }

      const extension = pathOr<Partial<Extension>, Extension>(
        {},
        [treePath],
        extensions
      )

      const hasTitleInBlock = !!extension.title

      const isRoot = isRootComponent(2)({ treePath })

      const isEditable =
        isComponentEditableMap[componentName] !== undefined
          ? isComponentEditableMap[componentName]
          : (isComponentEditableMap[componentName] =
              extension.hasContentSchema || hasContentPropsInSchema(schema))

      const shouldShow =
        isSamePage(page, treePath) &&
        (hasTitleInBlock || (hasTitleInSchema && (isRoot || isEditable)))

      if (shouldShow) {
        sidebarComponentMap[treePath] = {
          isEditable,
          name: extension.title || schema.title,
          treePath,
        }
      }

      return shouldShow
    })
    .sort((treePathA, treePathB) => {
      const splitTreePathA = treePathA.split('/')
      const parentPathA = splitTreePathA
        .slice(0, splitTreePathA.length - 1)
        .join('/')

      const splitTreePathB = treePathB.split('/')
      const parentPathB = splitTreePathB
        .slice(0, splitTreePathB.length - 1)
        .join('/')

      const nameA = splitTreePathA[splitTreePathA.length - 1]
      const nameB = splitTreePathB[splitTreePathB.length - 1]

      if (parentPathA !== parentPathB) {
        return 0
      }

      const parentContainerProps = getParentContainerProps(parentPathA)

      const firstElementPosition = parentContainerProps.findIndex(
        ({ extensionPointId }) => {
          return nameA === extensionPointId
        }
      )
      const secondElementPosition = parentContainerProps.findIndex(
        ({ extensionPointId }) => {
          return nameB === extensionPointId
        }
      )

      const areBothElementsInProps =
        firstElementPosition !== -1 && secondElementPosition !== -1

      if (
        areBothElementsInProps &&
        firstElementPosition > secondElementPosition
      ) {
        return 1
      }

      if (
        areBothElementsInProps &&
        firstElementPosition < secondElementPosition
      ) {
        return -1
      }

      return treePathA > treePathB ? 1 : -1
    })
    .map<SidebarComponent>(treePath => sidebarComponentMap[treePath])
}

export const getInitialComponents = ({
  extensions,
  page,
}: Pick<RenderContext, 'extensions' | 'page'>) =>
  getComponents(extensions, getIframeRenderComponents(), page)

export const getIsSitewide = (extensions: Extensions, editTreePath: string) => {
  const blockPath = getBlockPath(extensions, editTreePath)

  return (
    (blockPath.length > 0 &&
      ['AFTER', 'AROUND', 'BEFORE'].includes(blockPath[1].role)) ||
    false
  )
}

export const getIsDefaultContent: (
  configuration: Pick<ExtensionConfiguration, 'origin'>
) => boolean = configuration => configuration.origin !== null

export const isUnidentifiedPageContext = (
  pageContext: RenderRuntime['route']['pageContext']
) => pageContext.type !== '*' && pageContext.id === '*'

export const omitUndefined = (obj: Extension['content']) =>
  Object.entries(obj).reduce((acc, [currKey, currValue]) => {
    if (typeof currValue === 'undefined') {
      return acc
    }

    return { ...acc, [currKey]: currValue }
  }, {})

export const throttledUpdateExtensionFromForm = throttle(
  data => updateExtensionFromForm(data),
  200
)
