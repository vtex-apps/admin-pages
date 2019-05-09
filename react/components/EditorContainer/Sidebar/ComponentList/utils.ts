import { filter, flatten, partition } from 'ramda'

import { SidebarComponent } from '../typings'

import { getBlockRole } from '../../../../utils/blocks'
import { NormalizedComponent, NormalizedRelativeRoot } from './typings'

const pathLength = (path: string) => path.split('/').length

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
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

export const isRootComponentRelative = (minimumTreePathSize: number) => (
  rootComponent: SidebarComponent
) => {
  const splitTreePath = rootComponent.treePath.split('/')

  return (
    splitTreePath[minimumTreePathSize - 1].startsWith('$') ||
    (splitTreePath.length === minimumTreePathSize + 1 &&
      splitTreePath[minimumTreePathSize].startsWith('$'))
  )
}

const mountFullTree = (
  root: SidebarComponent,
  rootOwnLeaves: SidebarComponent[]
): NormalizedComponent => {
  if (rootOwnLeaves.length === 0) {
    return { ...root, isSortable: false }
  }
  const rootTreePathLength = pathLength(root.treePath)
  const immediateChildren = rootOwnLeaves.filter(
    ({ treePath: childPath }) =>
      rootTreePathLength + 1 === pathLength(childPath)
  )
  const nonImmediateChildren = rootOwnLeaves.filter(
    ({ treePath: childPath }) => rootTreePathLength + 1 < pathLength(childPath)
  )

  return {
    ...root,
    components: immediateChildren.map(child => {
      const grandChildren = nonImmediateChildren.filter(({ treePath }) =>
        treePath.startsWith(child.treePath)
      )
      return mountFullTree(child, grandChildren)
    }),
    isSortable: false,
  }
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

  const reduceRoot = (
    acc: SidebarComponent[],
    root: SidebarComponent
  ): SidebarComponent[] => {
    const { treePath: currentRootPath } = root
    const rootPathLength = pathLength(currentRootPath)
    const childrenFromRoot = leaves.filter(
      ({ treePath: leafTreePath }) =>
        leafTreePath.startsWith(currentRootPath) &&
        rootPathLength + 1 === pathLength(leafTreePath)
    )

    const rootObject = {
      ...root,
      components: childrenFromRoot.map(child => {
        const grandChildren = leaves.filter(({ treePath }) =>
          treePath.startsWith(child.treePath)
        )
        return mountFullTree(child, grandChildren)
      }),
      isSortable: false,
    }
    return acc.concat(rootObject)
  }

  const trees = roots.reduce<SidebarComponent[]>(reduceRoot, [])

  return trees
}

export const pureSplice = <T>(index: number, target: T[]) => [
  ...target.slice(0, index),
  ...target.slice(index + 1, target.length),
]
