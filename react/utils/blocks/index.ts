import { BlockRole, RelativeBlocks } from './typings'

type BlockRolesForTree = BlockRole | 'blocks'

export const getBlockRole = (treePathTail: string): BlockRolesForTree => {
  const blockRoleMatch = treePathTail.match(/\$(after|around|before)_/)

  if (!blockRoleMatch) {
    return 'blocks'
  }

  return blockRoleMatch[1] as BlockRolesForTree
}

export const getBlockPath = (
  extensions: RenderContext['extensions'],
  treePath: string
): BlockPath => {
  const splitTreePath = treePath.split('/')

  const blockId = extensions[treePath].blockId
  const blockRole = getBlockRole(splitTreePath[splitTreePath.length - 1])

  if (!blockId) {
    return []
  }

  const parentTreePath = splitTreePath
    .slice(0, splitTreePath.length - 1)
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
    return []
  }

  return [...parentBlockPath, formattedBlock]
}

export const getParentBlockId = (
  extensions: RenderContext['extensions'],
  splitTreePath: string[]
) => {
  const treePathTail = splitTreePath[splitTreePath.length - 1]

  const maybeBlockInfo = treePathTail.match(/\$(after|around|before)_(\d+)/)

  if (!maybeBlockInfo) {
    return null
  }

  const blockRole = maybeBlockInfo[1] as BlockRole
  const blockIndex = parseInt(maybeBlockInfo[2], 10)

  const parentTreePath = splitTreePath
    .slice(0, splitTreePath.length - 1)
    .join('/')

  const parentBlock = extensions[parentTreePath]

  const parentBlockRoleArray = parentBlock && parentBlock[blockRole]

  const blockId = parentBlockRoleArray && parentBlockRoleArray[blockIndex]

  return blockId
}

export const getRelativeBlocksIds = (
  treePath: string,
  extensions: RenderContext['extensions'],
  targetObj: RelativeBlocks
) =>
  Object.entries(targetObj).reduce<RelativeBlocks>(
    (acc, [currKey, currValue]) =>
      currValue
        ? {
            ...acc,
            [currKey]: currValue.map(
              block => extensions[`${treePath}/${block}`].blockId as string
            ),
          }
        : acc,
    {}
  )

export const getSitewideTreePath = (treePath: string) =>
  ['*', ...treePath.split('/').slice(1)].join('/')
