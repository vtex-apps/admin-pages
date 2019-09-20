import { flatten, path, pathOr } from 'ramda'
import { ComponentsRegistry } from 'vtex.render-runtime'

import { getBlockRole } from '../../../../utils/blocks'
import { getIframeRenderComponents } from '../../../../utils/components'

import { ModifiedSidebarComponent, SidebarComponent } from '../typings'

import { BlocksByRole, NormalizedBlock } from './typings'

export const generateWarningMessage = (name: string) =>
  `[Site Editor] Component "${name}" exports schema but doesn't have a "title" property, because of that, it won't appear in the lateral list. If this is intended, ignore this message.`

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

export const isRootComponent = (minimumTreePathSize: number) => (
  component: Pick<ModifiedSidebarComponent, 'treePath'>
) => {
  const splitTreePath = component.treePath.split('/')

  return (
    splitTreePath.length === minimumTreePathSize ||
    (splitTreePath.length === minimumTreePathSize + 1 &&
      splitTreePath[minimumTreePathSize].startsWith('$'))
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

const isSamePage = (page: string, treePath: string) => {
  const pageHead = page && page.split('/')[0]
  const treePathHead = treePath && treePath.split('/')[0]

  return pageHead && treePathHead && treePathHead === pageHead
}

export const getComponents = (
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

const hideNonExistentNodesInTreePath = (
  components: SidebarComponent[]
): ModifiedSidebarComponent[] => {
  const allTreePaths = components.reduce((acc, component) => {
    return acc.add(component.treePath)
  }, new Set())

  return components.map(component => {
    const paths = component.treePath.split('/')

    let prefix: string | null = null
    const existingPaths = paths.filter(path => {
      prefix = prefix === null ? path : [prefix, path].join('/')
      return allTreePaths.has(prefix)
    })

    return {
      ...component,
      modifiedTreePath: existingPaths.join('/'),
    }
  })
}

const modifiedPathLength = (component: ModifiedSidebarComponent) =>
  component.modifiedTreePath.split('/').length

const getComponentRole = (component: SidebarComponent): keyof BlocksByRole => {
  const splitTreePath = component.treePath.split('/')
  const treePathTail = splitTreePath[splitTreePath.length - 1]
  return getBlockRole(treePathTail)
}

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

const buildTree = (orderedNodes: ModifiedSidebarComponent[]) => {
  const nodes: Record<string, NormalizedBlock> = {}
  orderedNodes.forEach(({ modifiedTreePath, ...component }) => {
    const normalized = {
      ...component,
      components: [],
      isSortable: false,
    }
    const parentId = modifiedTreePath
      .split('/')
      .slice(0, -1)
      .join('/')

    nodes[modifiedTreePath] = normalized

    if (nodes[parentId] != null) {
      const parent = nodes[parentId]
      parent.components.push(normalized)
    }
  })
  return nodes
}

const partitionNodesChildrenByRole = (
  nodes: Record<string, NormalizedBlock>
) => {
  const partitionChildrenByRole = ({ components }: NormalizedBlock) =>
    components.reduce(
      (componentsByRole: BlocksByRole, component) => {
        componentsByRole[getComponentRole(component)].push(component)
        return componentsByRole
      },
      { around: [], after: [], before: [], blocks: [] }
    )

  return Object.values(nodes).reduce(
    (childrenByRole: Record<string, BlocksByRole>, node) => {
      childrenByRole[node.treePath] = partitionChildrenByRole(node)
      return childrenByRole
    },
    {}
  )
}
const hoistSubtrees = (
  component: NormalizedBlock,
  pathToChildrenByRole: Record<string, BlocksByRole>,
  isRoot: boolean = false
): NormalizedBlock[] => {
  const { treePath, components } = component
  const childrenByRole = pathToChildrenByRole[treePath]
  const blockChildren = components.filter(
    child => getComponentRole(child) === 'blocks'
  )
  const hoistedComponents = flatten(
    blockChildren.map(child => hoistSubtrees(child, pathToChildrenByRole))
  )
  const current = isRoot
    ? hoistedComponents
    : [{ ...component, components: hoistedComponents }]

  if (childrenByRole) {
    return [
      ...childrenByRole.around,
      ...childrenByRole.before,
      ...current,
      ...childrenByRole.after,
    ]
  }

  return [...current]
}

const hoistSurroundingBlocks = (
  nodes: Record<string, NormalizedBlock>,
  rootId: string
) => {
  const childrenByRole = partitionNodesChildrenByRole(nodes)

  return hoistSubtrees(nodes[rootId], childrenByRole, true)
}

export const normalize = (components: SidebarComponent[]) => {
  if (components.length === 0) {
    return []
  }
  const rootId = components[0].treePath.split('/')[0]
  const root = { treePath: rootId, name: 'root', isEditable: false }
  const allComponents = [root, ...components]

  const modifiedComponents = hideNonExistentNodesInTreePath(allComponents).sort(
    (cmp1: ModifiedSidebarComponent, cmp2: ModifiedSidebarComponent) =>
      modifiedPathLength(cmp1) - modifiedPathLength(cmp2)
  )

  const nodes = buildTree(modifiedComponents)

  return hoistSurroundingBlocks(nodes, rootId)
}

export const getNormalizedBlocks = ({
  extensions,
  page,
}: Pick<RenderContext, 'extensions' | 'page'>) =>
  normalize(getComponents(extensions, getIframeRenderComponents(), page))
