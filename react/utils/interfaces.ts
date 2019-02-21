export const getInterfacePath = (
  extensions: RenderContext['extensions'],
  treePath: string
): InterfacePath | null => {
  const splitTreePath = treePath.split('/')

  const extension = extensions[treePath]

  const interfaces = extension.implements

  const interfaceId = interfaces[interfaces.length - 1]

  const interfaceRole = getInterfaceRole(
    splitTreePath[splitTreePath.length - 1]
  )

  if (!interfaceId) {
    return null
  }

  const parentTreePath = splitTreePath
    .slice(0, splitTreePath.length - 1)
    .join('/')

  const formattedInteface: FormattedInterface = {
    id: interfaceId,
    index: extension.implementationIndex,
    role: interfaceRole
      ? (interfaceRole.toUpperCase() as FormattedInterface['role'])
      : 'BLOCK',
  }

  if (parentTreePath.length === 0) {
    const formattedTemplateInterface: FormattedInterface = {
      ...formattedInteface,
      role: 'TEMPLATE',
    }

    return [formattedTemplateInterface]
  }

  const parentInterfacePath = getInterfacePath(extensions, parentTreePath)

  if (!parentInterfacePath) {
    return null
  }

  return [...parentInterfacePath, formattedInteface]
}

const getInterfaceRole = (treePathTail: string) => {
  const interfaceRoleMatch = treePathTail.match(/\$(after|around|before)_/)

  if (!interfaceRoleMatch) {
    return null
  }

  return interfaceRoleMatch[1] as InterfaceRole
}
