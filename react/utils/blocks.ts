export const getBlockRole = (treePathTail: string) => {
  const blockRoleMatch = treePathTail.match(/\$(after|around|before)_/)

  if (!blockRoleMatch) {
    return null
  }

  return blockRoleMatch[1] as 'after' | 'around' | 'before'
}

export const getBlockPath = (
  extensions: RenderContext['extensions'],
  treePath: string
): BlockPath | null => {
  const splittedTreePath = treePath.split('/')

  const blockId = extensions[treePath].blockId
  const blockRole = getBlockRole(splittedTreePath[splittedTreePath.length - 1])

  if (!blockId) {
    return null
  }

  const parentTreePath = splittedTreePath
    .slice(0, splittedTreePath.length - 1)
    .join('/')

  const formattedBlock: FormattedBlock = {
    id: blockId,
    role: blockRole
      ? (blockRole.toUpperCase() as FormattedBlock['role'])
      : 'BLOCK',
  }

  if (parentTreePath.length === 0) {
    const formattedTemplateBlock: FormattedBlock = {
      ...formattedBlock,
      role: 'TEMPLATE',
    }

    return [formattedTemplateBlock]
  }

  const parentBlockPath = getBlockPath(extensions, parentTreePath)

  if (!parentBlockPath) {
    return null
  }

  return [...parentBlockPath, formattedBlock]
}

export const getParentBlockId = (
  extensions: RenderContext['extensions'],
  splittedTreePath: string[]
) => {
  const treePathTail = splittedTreePath[splittedTreePath.length - 1]

  const match = treePathTail.match(/\$(after|around|before)_(\d+)/)

  if (!match) {
    return null
  }

  const blockRole = match[1] as 'after' | 'around' | 'before'
  const blockIndex = parseInt(match[2], 10)

  const parentTreePath = splittedTreePath
    .slice(0, splittedTreePath.length - 1)
    .join('/')

  const parentBlock = extensions[parentTreePath]

  const parentBlockRoleArray = parentBlock && parentBlock[blockRole]

  const blockId = parentBlockRoleArray && parentBlockRoleArray[blockIndex]

  return blockId
}
