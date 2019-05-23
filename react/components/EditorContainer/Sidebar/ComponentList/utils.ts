import { filter, flatten } from 'ramda'

import { ModifiedSidebarComponent, SidebarComponent } from '../typings'

import { getBlockRole } from '../../../../utils/blocks'
import { ComponentsByRole, NormalizedComponent } from './typings'

const removeFalsyValues = filter(Boolean)

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

export const isChild = (rootTreePath: string, childTreePath: string) => {
  const splitRootTreePath = removeFalsyValues(rootTreePath.split('/'))
  const splitChildTreePath = removeFalsyValues(childTreePath.split('/'))

  return (
    splitRootTreePath.length > 0 &&
    splitRootTreePath.length !== splitChildTreePath.length &&
    splitRootTreePath.every((path, id) => {
      return path === splitChildTreePath[id]
    })
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

const parentTreePath = (path: string) =>
  path
    .split('/')
    .slice(0, -1)
    .join('/')

const getComponentRole = (
  component: SidebarComponent
): keyof ComponentsByRole => {
  const splitTreePath = component.treePath.split('/')
  const treePathTail = splitTreePath[splitTreePath.length - 1]
  return getBlockRole(treePathTail)
}

export const normalize = (components: SidebarComponent[]) => {
  if (components.length === 0) {
    return []
  }
  const rootId = components[0].treePath.split('/')[0]
  const root = { treePath: rootId, name: 'root' }
  const allComponents = [root, ...components]

  const modifiedComponents = hideNonExistentNodesInTreePath(allComponents).sort(
    (cmp1, cmp2) => modifiedPathLength(cmp1) - modifiedPathLength(cmp2)
  )

  const nodes = buildTree(modifiedComponents)
  return hoistSurroundingBlocks(nodes, rootId)
}

const buildTree = (orderedNodes: ModifiedSidebarComponent[]) => {
  const nodes: Record<string, NormalizedComponent> = {}
  orderedNodes.forEach(({ modifiedTreePath, ...component }) => {
    const normalized = { ...component, isSortable: false, components: [] }
    const parentId = parentTreePath(modifiedTreePath)
    nodes[modifiedTreePath] = normalized

    if (nodes[parentId] != null) {
      const parent = nodes[parentId]
      parent.components.push(normalized)
    }
  })
  return nodes
}

const hoistSurroundingBlocks = (
  nodes: Record<string, NormalizedComponent>,
  rootId: string
) => {
  const childrenByRole = partitionNodesChildrenByRole(nodes)
  return hoistSubtrees(nodes[rootId], childrenByRole, true)
}

const partitionNodesChildrenByRole = (
  nodes: Record<string, NormalizedComponent>
) => {
  const partitionChildrenByRole = ({ components }: NormalizedComponent) =>
    components.reduce(
      (componentsByRole: ComponentsByRole, component) => {
        componentsByRole[getComponentRole(component)].push(component)
        return componentsByRole
      },
      { around: [], after: [], before: [], blocks: [] }
    )
  return Object.values(nodes).reduce(
    (childrenByRole: Record<string, ComponentsByRole>, node) => {
      childrenByRole[node.treePath] = partitionChildrenByRole(node)
      return childrenByRole
    },
    {}
  )
}

const hoistSubtrees = (
  component: NormalizedComponent,
  pathToChildrenByRole: Record<string, ComponentsByRole>,
  isRoot: boolean = false
): NormalizedComponent[] => {
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
  return [
    ...childrenByRole.around,
    ...childrenByRole.before,
    ...current,
    ...childrenByRole.after,
  ]
}

export const pureSplice = <T>(index: number, target: T[]) => [
  ...target.slice(0, index),
  ...target.slice(index + 1, target.length),
]
