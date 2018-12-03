import { SidebarComponent } from '../typings'

import { NormalizedComponent } from './typings'

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
      components.filter(isTopLevelComponent) as NormalizedComponent[],
    )

export const isTopLevelComponent = (component: SidebarComponent) =>
  isStoreLevelComponent(component) ||
  (!isStoreLevelChildComponent(component) &&
    component.treePath.split('/').length === 3)

export const isStoreLevelComponent = (component: SidebarComponent) =>
  /^store\/(header|footer)$/.test(component.treePath)

export const isStoreLevelChildComponent = (component: SidebarComponent) =>
  /^store\/(header|footer)\/.+$/.test(component.treePath)
