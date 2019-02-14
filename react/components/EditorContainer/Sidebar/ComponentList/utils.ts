import { flatten, partition } from 'ramda'

import { SidebarComponent } from '../typings'

import { getBlockRole } from '../../../../utils/blocks'
import { NormalizedComponent, NormalizedRelativeRoot } from './typings'

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

export const isRootComponent = (component: SidebarComponent) => {
  const splitTreePath = component.treePath.split('/')

  return (
    splitTreePath.length === 2 ||
    (splitTreePath.length === 3 && splitTreePath[2].startsWith('$'))
  )
}

export const isRootComponentRelative = (rootComponent: SidebarComponent) => {
  const splitTreePath = rootComponent.treePath.split('/')

  return (
    splitTreePath[1].startsWith('$') ||
    (splitTreePath.length === 3 && splitTreePath[2].startsWith('$'))
  )
}

export const noop = () => undefined

export const normalize = (components: SidebarComponent[]) => {
  const [roots, leaves] = partition(isRootComponent, components)

  const [relativeRoots, nonRelativeRoots] = partition(
    isRootComponentRelative,
    roots
  )

  const normalizedRelativeRoots = relativeRoots.reduce<NormalizedRelativeRoot>(
    (acc, currRoot) => {
      const splitTreePath = currRoot.treePath.split('/')

      const treePathTail = splitTreePath[splitTreePath.length - 1]

      const blockRole = getBlockRole(treePathTail)

      if (!blockRole) {
        return acc
      }

      const currNormalizedRoot = { ...currRoot, isSortable: false }

      if (blockRole === 'around' && splitTreePath.length === 3) {
        return {
          ...acc,
          nestedAround: [...acc.nestedAround, currNormalizedRoot],
        }
      }

      return {
        ...acc,
        [blockRole]: [...acc[blockRole], currNormalizedRoot],
      }
    },
    { after: [], around: [], before: [], nestedAround: [] }
  )

  const normalizedNonRelativeRoots = nonRelativeRoots.map(root => ({
    ...root,
    isSortable: true,
  }))

  const sortedRoots = [
    ...normalizedRelativeRoots.before,
    ...normalizedRelativeRoots.around,
    ...flatten(
      normalizedNonRelativeRoots.map(nonRelativeRoot => [
        ...normalizedRelativeRoots.nestedAround.filter(
          (nestedAround: NormalizedComponent) =>
            nestedAround.treePath.startsWith(nonRelativeRoot.treePath)
        ),
        nonRelativeRoot,
      ])
    ),
    ...normalizedRelativeRoots.after,
  ]

  return leaves
    .map(leaf => ({ ...leaf, isSortable: false }))
    .reduce<NormalizedComponent[]>(
      (acc, leaf) =>
        acc.map(root =>
          leaf.treePath.startsWith(root.treePath)
            ? {
                ...root,
                components: root.components
                  ? [...root.components, leaf]
                  : [leaf],
              }
            : root
        ),
      sortedRoots
    )
}

export const pureSplice = <T>(index: number, target: T[]) => [
  ...target.slice(0, index),
  ...target.slice(index + 1, target.length),
]
