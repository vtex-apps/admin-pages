import { has, path, pathOr } from 'ramda'
import { ComponentsRegistry } from 'vtex.render-runtime'

import { SidebarComponent } from './typings'

const isSamePage = (page: string, treePath: string) => {
  const pageHead = page.split('/')[0]
  const treePathHead = treePath.split('/')[0]

  return treePathHead === pageHead
}

const getParentContainerPropsGetter = (extensions: Extensions) => (
  parentPath: string
) =>
  pathOr<string[], string[]>([], [parentPath, 'props', 'elements'], extensions)

const getComponentNameGetterFromExtensions = (extensions: Extensions) => (
  treePath: string
) => extensions[treePath].component || ''

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

export function getComponents(
  extensions: Extensions,
  components: ComponentsRegistry | null,
  page: string
) {
  const getParentContainerProps = getParentContainerPropsGetter(extensions)

  const getComponentSchema = getComponentSchemaGetter(components, extensions)

  return Object.keys(extensions)
    .filter(treePath => {
      const schema = getComponentSchema(treePath)

      return isSamePage(page, treePath) && !!schema && has('title', schema)
    })
    .sort((treePathA, treePathB) => {
      const parentPathA = `${treePathA.split('/')[0]}/${
        treePathA.split('/')[1]
      }`

      const parentPathB = `${treePathB.split('/')[0]}/${
        treePathB.split('/')[1]
      }`

      const nameA = treePathA.split('/')[treePathA.split('/').length - 1]
      const nameB = treePathB.split('/')[treePathB.split('/').length - 1]

      if (parentPathA !== parentPathB) {
        return 0
      }

      const parentContainerProps = getParentContainerProps(parentPathA)
      const firstElementPosition = parentContainerProps.indexOf(nameA)
      const secondElementPosition = parentContainerProps.indexOf(nameB)
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
    .map<SidebarComponent>(treePath => ({
      name: getComponentSchema(treePath).title!,
      treePath,
    }))
}
