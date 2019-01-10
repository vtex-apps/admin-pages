import { SidebarComponent } from '../typings'

import { partition } from 'ramda'
import { NormalizedComponent } from './typings'

export const normalizeComponents = (components: SidebarComponent[]) => {
  const [roots, leaves] = partition(isRootComponent, components)

  return leaves.reduce(
      (acc, currComponent) =>
        acc.map(item =>
          currComponent.treePath.startsWith(item.treePath)
            ? {
              ...item,
              components: item.components
                ? [...item.components, currComponent]
                : [currComponent],
            }
            : item,
        ),
      roots as NormalizedComponent[]
    ).map(item => ({...item, isSortable: true}))
}

export const isRootComponent = (component: SidebarComponent) =>
  component.treePath.split('/') .length  === 2

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')
  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }
  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}
