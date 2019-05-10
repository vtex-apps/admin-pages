import { curry, filter, flatten, partition } from 'ramda'

import { SidebarComponent } from '../typings'

import { getBlockRole } from '../../../../utils/blocks'
import { NormalizedComponent, TreesByRole } from './typings'

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

const isChild = (rootTreePath: string, childTreePath: string) => {
  const splitRootTreePath = rootTreePath.split('/')
  const splitChildTreePath = childTreePath.split('/')

  return (
    splitRootTreePath.length > 0 &&
    splitRootTreePath.length !== splitChildTreePath.length &&
    splitRootTreePath.every((path, id) => {
      return path === splitChildTreePath[id]
    })
  )
}

export const isRootComponent = (minimumTreePathSize: number) => (
  component: SidebarComponent
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
  (leaves: SidebarComponent[], root: SidebarComponent): NormalizedComponent => {
    if (leaves.length === 0) {
      return { ...root, components: [], isSortable: false }
    }

    const { children, grandChildren } = getChildrenAndGrandChildren(
      root.treePath,
      leaves
    )

    return {
      ...root,
      components: children.map(nextRoot => {
        const nextChildren = grandChildren.filter(node =>
          isChild(nextRoot.treePath, node.treePath)
        )
        return mountFullTree(nextChildren, nextRoot)
      }),
      isSortable: false,
    }
  }
)

const getChildrenAndGrandChildren = (
  rootTreePath: string,
  nodes: SidebarComponent[]
) => {
  const descendants = nodes.filter(node => isChild(rootTreePath, node.treePath))

  const minimumTreePathSize = descendants.reduce((min, currentComponent) => {
    const treePathSize = currentComponent.treePath.split('/').length
    return treePathSize < min ? treePathSize : min
  }, Infinity)

  return descendants.reduce<{
    children: SidebarComponent[]
    grandChildren: SidebarComponent[]
  }>(
    (acc, node) => {
      const nodeRelation: keyof typeof acc =
        minimumTreePathSize === pathLength(node.treePath)
          ? 'children'
          : 'grandChildren'

      return {
        ...acc,
        [nodeRelation]: acc[nodeRelation].concat(node),
      }
    },
    { children: [], grandChildren: [] }
  )
}

export const normalize = (components: SidebarComponent[]) => {
  const minimumTreePathSize = components.reduce((acc, currentComponent) => {
    const treePathSize = currentComponent.treePath.split('/').length
    return treePathSize < acc ? treePathSize : acc
  }, Infinity)

  const [roots, leaves] = partition(
    isRootComponent(minimumTreePathSize),
    components
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
