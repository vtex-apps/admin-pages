import { flatten, partition } from 'ramda'

import { SidebarComponent } from '../typings'

import { NormalizedComponent, NormalizedRelativeRoot } from './typings'

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

export const isRootComponent = (component: SidebarComponent) => {
  const splittedTreePath = component.treePath.split('/')

  return (
    splittedTreePath.length === 2 ||
    (splittedTreePath.length === 3 && splittedTreePath[2].startsWith('$'))
  )
}

export const isRootComponentRelative = (rootComponent: SidebarComponent) => {
  const splittedTreePath = rootComponent.treePath.split('/')

  return (
    splittedTreePath[1].startsWith('$') ||
    (splittedTreePath.length === 3 && splittedTreePath[2].startsWith('$'))
  )
}

export const normalize = (components: SidebarComponent[]) => {
  const [roots, leaves] = partition(isRootComponent, components)

  const [relativeRoots, nonRelativeRoots] = partition(
    isRootComponentRelative,
    roots
  )

  const normalizedRelativeRoots = relativeRoots.reduce<NormalizedRelativeRoot>(
    (acc, currRoot) => {
      const splittedTreePath = currRoot.treePath.split('/')

      const treePathTail = splittedTreePath[splittedTreePath.length - 1]

      const blockTypeMatch = treePathTail.match(/\$(after|around|before)_/)

      if (!blockTypeMatch) {
        return acc
      }

      const blockType = blockTypeMatch[1] as 'after' | 'around' | 'before'

      const currNormalizedRoot = { ...currRoot, isSortable: false }

      if (blockType === 'around' && splittedTreePath.length === 3) {
        return {
          ...acc,
          nestedAround: [...acc.nestedAround, currNormalizedRoot]
        }
      }

      return {
        ...acc,
        [blockType]: [...acc[blockType], currNormalizedRoot]
      }
    },
    { after: [], around: [], before: [], nestedAround: [] }
  )

  const normalizedNonRelativeRoots = nonRelativeRoots.map(root => ({
    ...root,
    isSortable: true
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
        nonRelativeRoot
      ])
    ),
    ...normalizedRelativeRoots.after
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
                : [leaf]
            }
            : root
        ),
      sortedRoots
    )
}
