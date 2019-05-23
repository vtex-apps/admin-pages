import { curry, filter, find, flatten, omit, partition, propEq } from 'ramda'

import { SidebarComponent } from '../typings'

import { getBlockRole } from '../../../../utils/blocks'
import { NormalizedComponent, TreesByRole } from './typings'

const removeFalsyValues = filter(Boolean)

interface ModifiedSidebarComponent extends SidebarComponent {
  modifiedTreePath: string
}

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

const pathLength = (path: string) => path.split('/').length

const mountFullTree = curry(
  (
    leaves: ModifiedSidebarComponent[],
    root: ModifiedSidebarComponent
  ): NormalizedComponent => {
    const rootToSpread = omit(['modifiedTreePath'], root)
    if (leaves.length === 0) {
      return { ...rootToSpread, components: [], isSortable: false }
    }

    const { children, grandchildren } = getChildrenAndGrandchildren(
      root.modifiedTreePath,
      leaves
    )

    return {
      ...rootToSpread,
      components: children.map(nextRoot => {
        const nextChildren = grandchildren.filter(node =>
          isChild(nextRoot.modifiedTreePath, node.modifiedTreePath)
        )
        return mountFullTree(nextChildren, nextRoot)
      }),
      isSortable: false,
    }
  }
)

const getChildrenAndGrandchildren = (
  rootTreePath: string,
  nodes: ModifiedSidebarComponent[]
) => {
  const descendants = nodes.filter(node =>
    isChild(rootTreePath, node.modifiedTreePath)
  )

  const minimumTreePathSize = descendants.reduce((min, currentComponent) => {
    const treePathSize = currentComponent.modifiedTreePath.split('/').length
    return treePathSize < min ? treePathSize : min
  }, Infinity)

  return descendants.reduce<{
    children: ModifiedSidebarComponent[]
    grandchildren: ModifiedSidebarComponent[]
  }>(
    (acc, node) => {
      const nodeRelation: keyof typeof acc =
        minimumTreePathSize === pathLength(node.modifiedTreePath)
          ? 'children'
          : 'grandchildren'

      return {
        ...acc,
        [nodeRelation]: acc[nodeRelation].concat(node),
      }
    },
    { children: [], grandchildren: [] }
  )
}

const hideNonExistentNodesInTreePath = (
  components: SidebarComponent[]
): ModifiedSidebarComponent[] => {
  return components.map(node => {
    const splitTreePath = node.treePath.split('/')
    const leaf = splitTreePath.pop() // mutates array
    let commonAncestor
    const newTreePath = [leaf]

    while (splitTreePath.length > 0) {
      const currentTreePath = splitTreePath.join('/')
      const currentNode = splitTreePath.pop() // mutates array
      commonAncestor = find(propEq('treePath', currentTreePath), components)
      if (commonAncestor || splitTreePath.length === 0) {
        newTreePath.push(currentNode)
      }
    }

    return {
      ...node,
      modifiedTreePath: newTreePath.reverse().join('/'),
    }
  })
}

export const normalize = (components: SidebarComponent[]) => {
  const modifiedComponents = hideNonExistentNodesInTreePath(components)
  const minimumTreePathSize = modifiedComponents.reduce(
    (acc, { modifiedTreePath }) => Math.min(acc, pathLength(modifiedTreePath)),
    Infinity
  )

  const [roots, leaves] = partition(
    isRootComponent(minimumTreePathSize),
    modifiedComponents
  )

  const trees = roots.map<SidebarComponent>(mountFullTree(leaves))

  const treesByRole = trees.reduce<TreesByRole>(
    (acc, tree) => {
      const splitTreePath = tree.treePath.split('/')
      const treePathTail = splitTreePath[splitTreePath.length - 1]

      const blockRole = getBlockRole(treePathTail)
      return {
        ...acc,
        [blockRole]: [...acc[blockRole], tree],
      }
    },
    { after: [], around: [], before: [], blocks: [] }
  )

  const prependBlocksWithAround = flatten(
    treesByRole.blocks.map(block => {
      const aroundForBlock = treesByRole.around.find(aroundBlock => {
        return isChild(block.treePath, aroundBlock.treePath)
      })
      return aroundForBlock ? [aroundForBlock, block] : block
    })
  )

  const reorderByRole = [
    ...treesByRole.before,
    ...prependBlocksWithAround,
    ...treesByRole.after,
  ]

  return reorderByRole
}

export const pureSplice = <T>(index: number, target: T[]) => [
  ...target.slice(0, index),
  ...target.slice(index + 1, target.length),
]
