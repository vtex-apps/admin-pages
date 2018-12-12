import { NormalizedComponent, SidebarComponent } from '../typings'

export const normalizeComponents = (components: SidebarComponent[]) =>
  components
    .filter(item => !isTopLevelComponent(item))
    .reduce(
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
      components.filter(isTopLevelComponent).map(defineSortability),
    )

export const isTopLevelComponent = (component: SidebarComponent) =>
  isStoreLevelComponent(component) ||
  (!isStoreLevelChildComponent(component) &&
    component.treePath.split('/').length === 3)

export const isStoreLevelComponent = (component: SidebarComponent) =>
  /^store\/(header|footer)$/.test(component.treePath)

export const isStoreLevelChildComponent = (component: SidebarComponent) =>
  /^store\/(header|footer)\/.+$/.test(component.treePath)

export const getParentTreePath = (treePath: string): string => {
  const splitTreePath = treePath.split('/')

  if (splitTreePath.length === 1) {
    return splitTreePath.join('')
  }

  return splitTreePath.slice(0, splitTreePath.length - 1).join('/')
}

export const defineSortability = (
  component: SidebarComponent,
): NormalizedComponent => ({
  ...component,
  isSortable:
    !isStoreLevelComponent(component) && isTopLevelComponent(component),
})
